import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient

from companies.models import Company
from documents.models import LegalDocument

User = get_user_model()


@pytest.fixture(autouse=True)
def _reset_throttle_cache():
    """Le throttling DRF s'appuie sur le cache : on repart de zero a chaque test."""
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def client_user(db):
    return User.objects.create_user(email="client@example.com", password="pass12345")


@pytest.fixture
def other_client(db):
    return User.objects.create_user(email="autre@example.com", password="pass12345")


@pytest.fixture
def lawyer_user(db):
    return User.objects.create_user(
        email="juriste@example.com", password="pass12345", role=User.Role.LAWYER
    )


@pytest.fixture
def auth(api):
    def _auth(user):
        api.force_authenticate(user=user)
        return api

    return _auth


@pytest.fixture
def company(client_user):
    return Company.objects.create(
        owner=client_user, name="Acme SAS", legal_form=Company.LegalForm.SAS
    )


@pytest.fixture
def document(company):
    return LegalDocument.objects.create(
        company=company, doc_type=LegalDocument.DocType.STATUTS
    )
