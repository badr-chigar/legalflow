from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework import status

from documents.models import LegalDocument, SignatureRequest

pytestmark = pytest.mark.django_db


def _request_otp(api, document_id):
    res = api.post(f"/api/documents/{document_id}/request-signature/")
    assert res.status_code == status.HTTP_201_CREATED
    # Le code n'est pas expose dans la reponse (sauf OTP_EXPOSE_CODE) : on le lit
    # en base, comme le ferait un test d'integration realiste.
    return (
        SignatureRequest.objects.filter(document_id=document_id)
        .latest("created_at")
        .otp_code
    )


def test_request_signature_creates_pending_otp(auth, client_user, document):
    api = auth(client_user)
    code = _request_otp(api, document.id)
    assert len(code) == 6 and code.isdigit()
    sig = SignatureRequest.objects.get(document=document)
    assert sig.status == SignatureRequest.Status.PENDING
    assert sig.expires_at > timezone.now()


def test_otp_not_leaked_in_response_by_default(auth, client_user, document, settings):
    settings.OTP_EXPOSE_CODE = False
    api = auth(client_user)
    res = api.post(f"/api/documents/{document.id}/request-signature/")
    assert res.status_code == status.HTTP_201_CREATED
    assert "otp_code_debug" not in res.data
    assert "otp_code" not in res.data  # jamais serialise non plus


def test_otp_exposed_only_when_flag_enabled(auth, client_user, document, settings):
    settings.OTP_EXPOSE_CODE = True
    api = auth(client_user)
    res = api.post(f"/api/documents/{document.id}/request-signature/")
    assert res.data["otp_code_debug"].isdigit()


def test_two_otp_requests_yield_different_codes(auth, client_user, document):
    api = auth(client_user)
    first = _request_otp(api, document.id)
    second = _request_otp(api, document.id)
    assert first != second  # code aleatoire, pas statique


def test_verify_with_correct_code_signs_document(auth, client_user, document):
    api = auth(client_user)
    code = _request_otp(api, document.id)

    res = api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": code},
        format="json",
    )
    assert res.status_code == status.HTTP_200_OK
    document.refresh_from_db()
    assert document.status == LegalDocument.Status.SIGNED
    assert SignatureRequest.objects.get(document=document).status == "signe"


def test_verify_with_wrong_code_increments_attempts(auth, client_user, document):
    api = auth(client_user)
    _request_otp(api, document.id)

    res = api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": "000000"},
        format="json",
    )
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    sig = SignatureRequest.objects.get(document=document)
    assert sig.attempts == 1
    assert sig.status == SignatureRequest.Status.PENDING
    document.refresh_from_db()
    assert document.status == LegalDocument.Status.DRAFT


def test_expired_otp_is_rejected(auth, client_user, document):
    api = auth(client_user)
    _request_otp(api, document.id)
    sig = SignatureRequest.objects.get(document=document)
    sig.expires_at = timezone.now() - timedelta(seconds=1)
    sig.save(update_fields=["expires_at"])

    res = api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": sig.otp_code},
        format="json",
    )
    assert res.status_code == status.HTTP_410_GONE
    sig.refresh_from_db()
    assert sig.status == SignatureRequest.Status.EXPIRED


def test_otp_locks_after_max_attempts(auth, client_user, document, settings):
    settings.OTP_MAX_ATTEMPTS = 3
    api = auth(client_user)
    code = _request_otp(api, document.id)

    for _ in range(3):
        api.post(
            f"/api/documents/{document.id}/verify-signature/",
            {"code": "999999"},
            format="json",
        )

    # even the right code now fails: request is locked
    res = api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": code},
        format="json",
    )
    assert res.status_code == status.HTTP_429_TOO_MANY_REQUESTS


def test_code_cannot_be_reused_after_signing(auth, client_user, document):
    api = auth(client_user)
    code = _request_otp(api, document.id)
    api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": code},
        format="json",
    )
    res = api.post(
        f"/api/documents/{document.id}/verify-signature/",
        {"code": code},
        format="json",
    )
    assert res.status_code == status.HTTP_409_CONFLICT


def test_client_cannot_sign_another_clients_document(auth, other_client, document):
    api = auth(other_client)
    res = api.post(f"/api/documents/{document.id}/request-signature/")
    assert res.status_code == status.HTTP_404_NOT_FOUND
