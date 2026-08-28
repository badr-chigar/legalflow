from rest_framework import serializers

from companies.models import Company

from .models import LegalDocument, SignatureRequest


class LegalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalDocument
        fields = (
            "id",
            "company",
            "doc_type",
            "status",
            "file",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "created_at", "updated_at")

    def validate_company(self, company):
        user = self.context["request"].user
        if user.is_platform_admin or user.is_lawyer:
            return company
        if company.owner_id != user.id:
            raise serializers.ValidationError(
                "Vous ne pouvez rattacher un document qu'a l'une de vos societes."
            )
        return company


class SignatureRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignatureRequest
        fields = (
            "id",
            "document",
            "status",
            "attempts",
            "created_at",
            "expires_at",
            "signed_at",
        )
        read_only_fields = fields


class VerifySignatureSerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)
