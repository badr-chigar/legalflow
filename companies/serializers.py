from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source="owner.email", read_only=True)

    class Meta:
        model = Company
        fields = (
            "id",
            "owner",
            "owner_email",
            "name",
            "legal_form",
            "share_capital",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "owner_email", "created_at", "updated_at")
