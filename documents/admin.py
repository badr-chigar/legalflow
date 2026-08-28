from django.contrib import admin

from .models import LegalDocument, SignatureRequest


@admin.register(LegalDocument)
class LegalDocumentAdmin(admin.ModelAdmin):
    list_display = ("doc_type", "company", "status", "created_at")
    list_filter = ("doc_type", "status")
    search_fields = ("company__name",)


@admin.register(SignatureRequest)
class SignatureRequestAdmin(admin.ModelAdmin):
    list_display = ("document", "status", "attempts", "created_at", "expires_at")
    list_filter = ("status",)
    readonly_fields = ("otp_code",)
