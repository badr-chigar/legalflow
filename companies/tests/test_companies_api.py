import pytest
from rest_framework import status

from companies.models import Company

pytestmark = pytest.mark.django_db


def test_client_crud_full_cycle(auth, client_user):
    api = auth(client_user)

    # CREATE
    res = api.post(
        "/api/companies/",
        {"name": "Nova SAS", "legal_form": "SAS", "share_capital": "1000.00"},
        format="json",
    )
    assert res.status_code == status.HTTP_201_CREATED
    company_id = res.data["id"]
    assert res.data["status"] == "brouillon"

    # LIST
    res = api.get("/api/companies/")
    assert res.status_code == status.HTTP_200_OK
    assert res.data["count"] == 1

    # RETRIEVE
    res = api.get(f"/api/companies/{company_id}/")
    assert res.data["name"] == "Nova SAS"

    # UPDATE (PUT)
    res = api.put(
        f"/api/companies/{company_id}/",
        {"name": "Nova SASU", "legal_form": "SASU", "share_capital": "500.00"},
        format="json",
    )
    assert res.status_code == status.HTTP_200_OK
    assert res.data["name"] == "Nova SASU"

    # PARTIAL UPDATE (PATCH)
    res = api.patch(
        f"/api/companies/{company_id}/", {"status": "en_revue"}, format="json"
    )
    assert res.data["status"] == "en_revue"

    # DELETE
    res = api.delete(f"/api/companies/{company_id}/")
    assert res.status_code == status.HTTP_204_NO_CONTENT
    assert not Company.objects.filter(id=company_id).exists()


def test_client_cannot_see_other_clients_company(auth, other_client, company):
    api = auth(other_client)

    res = api.get("/api/companies/")
    assert res.data["count"] == 0

    res = api.get(f"/api/companies/{company.id}/")
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_lawyer_sees_all_companies(auth, lawyer_user, company):
    api = auth(lawyer_user)
    res = api.get(f"/api/companies/{company.id}/")
    assert res.status_code == status.HTTP_200_OK


def test_anonymous_is_rejected(api):
    res = api.get("/api/companies/")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED
