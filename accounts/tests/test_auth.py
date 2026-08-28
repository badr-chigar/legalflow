import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()
pytestmark = pytest.mark.django_db

LOGIN = "/api/auth/login/"


def test_login_returns_jwt_pair(api):
    User.objects.create_user(email="u@example.com", password="pass12345")
    res = api.post(
        LOGIN, {"email": "u@example.com", "password": "pass12345"}, format="json"
    )
    assert res.status_code == status.HTTP_200_OK
    assert "access" in res.data and "refresh" in res.data


def test_login_wrong_password_is_401(api):
    User.objects.create_user(email="u@example.com", password="pass12345")
    res = api.post(
        LOGIN, {"email": "u@example.com", "password": "nope"}, format="json"
    )
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_is_rate_limited(api):
    # La config reelle autorise 10 tentatives / minute / IP : au-dela, 429.
    payload = {"email": "x@example.com", "password": "bad"}
    codes = [api.post(LOGIN, payload, format="json").status_code for _ in range(13)]
    assert codes.count(status.HTTP_401_UNAUTHORIZED) == 10
    assert codes[-1] == status.HTTP_429_TOO_MANY_REQUESTS  # brute-force bloque
