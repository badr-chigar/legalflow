"""
Amorce des données de démonstration — idempotent.

Comptes :
    juriste.demo@legalflow.test  (rôle juriste)
    client.demo@legalflow.test   (rôle client)
    mot de passe : demo-passphrase-2026

Plus quelques sociétés d'exemple + un document pour que le tableau de bord
ne soit pas vide. Ré-exécutable sans créer de doublon.
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from companies.models import Company
from documents.models import LegalDocument

User = get_user_model()

DEMO_PASSWORD = "demo-passphrase-2026"

USERS = [
    {
        "email": "juriste.demo@legalflow.test",
        "role": User.Role.LAWYER,
        "first_name": "Inès",
        "last_name": "Bennani",
    },
    {
        "email": "client.demo@legalflow.test",
        "role": User.Role.CLIENT,
        "first_name": "Camille",
        "last_name": "Dupont",
    },
]

COMPANIES = [
    {
        "name": "Atlas Conseil",
        "legal_form": Company.LegalForm.SARL,
        "share_capital": 50000,
        "status": Company.Status.IN_REVIEW,
        "with_statuts": True,
    },
    {
        "name": "Medina Studio",
        "legal_form": Company.LegalForm.SASU,
        "share_capital": 10000,
        "status": Company.Status.DRAFT,
        "with_statuts": False,
    },
]


class Command(BaseCommand):
    help = "Crée les comptes et données de démonstration (idempotent)."

    @transaction.atomic
    def handle(self, *args, **options):
        users = {}
        for spec in USERS:
            user, created = User.objects.get_or_create(
                email=spec["email"],
                defaults={
                    "role": spec["role"],
                    "first_name": spec["first_name"],
                    "last_name": spec["last_name"],
                },
            )
            # On garantit le mot de passe et le rôle à chaque exécution.
            user.role = spec["role"]
            user.first_name = spec["first_name"]
            user.last_name = spec["last_name"]
            user.set_password(DEMO_PASSWORD)
            user.save()
            users[spec["role"]] = user
            self.stdout.write(
                f"{'créé' if created else 'à jour'} : {user.email} ({user.role})"
            )

        client = users[User.Role.CLIENT]
        companies_created = documents_created = 0
        for spec in COMPANIES:
            company, created = Company.objects.get_or_create(
                owner=client,
                name=spec["name"],
                defaults={
                    "legal_form": spec["legal_form"],
                    "share_capital": spec["share_capital"],
                    "status": spec["status"],
                },
            )
            companies_created += int(created)

            if spec["with_statuts"] and not company.documents.filter(
                doc_type=LegalDocument.DocType.STATUTS
            ).exists():
                LegalDocument.objects.create(
                    company=company,
                    doc_type=LegalDocument.DocType.STATUTS,
                    status=LegalDocument.Status.DRAFT,
                )
                documents_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"OK — {User.objects.count()} comptes, "
                f"{Company.objects.count()} sociétés "
                f"(+{companies_created}), "
                f"{LegalDocument.objects.count()} documents "
                f"(+{documents_created})."
            )
        )
