from django.conf import settings
from django.db import models


class Company(models.Model):
    class LegalForm(models.TextChoices):
        SAS = "SAS", "SAS"
        SASU = "SASU", "SASU"
        SARL = "SARL", "SARL"
        EURL = "EURL", "EURL"
        SCI = "SCI", "SCI"
        MICRO = "MICRO", "Micro-entreprise"

    class Status(models.TextChoices):
        DRAFT = "brouillon", "Brouillon"
        IN_REVIEW = "en_revue", "En revue"
        FILED = "depose", "Depose au greffe"
        REGISTERED = "immatricule", "Immatricule"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="companies",
    )
    name = models.CharField("raison sociale", max_length=255)
    legal_form = models.CharField(max_length=8, choices=LegalForm.choices)
    share_capital = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.DRAFT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name_plural = "companies"

    def __str__(self):
        return f"{self.name} ({self.legal_form})"
