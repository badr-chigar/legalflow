import secrets
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class LegalDocument(models.Model):
    class DocType(models.TextChoices):
        STATUTS = "statuts", "Statuts"
        M0 = "m0", "Formulaire M0"
        DNC = "dnc", "Declaration de non-condamnation"
        BENEF = "beneficiaires", "Registre des beneficiaires effectifs"

    class Status(models.TextChoices):
        DRAFT = "brouillon", "Brouillon"
        SUBMITTED = "soumis", "Soumis"
        VALIDATED = "valide", "Valide"
        SIGNED = "signe", "Signe"

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="documents",
    )
    doc_type = models.CharField(max_length=16, choices=DocType.choices)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.DRAFT
    )
    file = models.FileField(upload_to="documents/%Y/%m/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.get_doc_type_display()} - {self.company.name}"


class SignatureRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "en_attente", "En attente"
        SIGNED = "signe", "Signe"
        EXPIRED = "expire", "Expire"

    document = models.ForeignKey(
        LegalDocument,
        on_delete=models.CASCADE,
        related_name="signature_requests",
    )
    otp_code = models.CharField(max_length=6, editable=False)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    signed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = f"{secrets.randbelow(1_000_000):06d}"
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(
                minutes=settings.OTP_TTL_MINUTES
            )
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def verify(self, code):
        """
        Returns (ok: bool, reason: str).
        Consumes one attempt; flips document + request status on success.
        """
        if self.status == self.Status.SIGNED:
            return False, "deja_signe"
        if self.is_expired or self.status == self.Status.EXPIRED:
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status"])
            return False, "expire"
        if self.attempts >= settings.OTP_MAX_ATTEMPTS:
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status"])
            return False, "trop_d_essais"

        self.attempts += 1
        if code != self.otp_code:
            self.save(update_fields=["attempts"])
            return False, "code_invalide"

        now = timezone.now()
        self.status = self.Status.SIGNED
        self.signed_at = now
        self.save(update_fields=["attempts", "status", "signed_at"])
        self.document.status = LegalDocument.Status.SIGNED
        self.document.save(update_fields=["status"])
        return True, "ok"
