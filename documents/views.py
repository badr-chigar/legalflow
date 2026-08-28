from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from companies.permissions import IsOwnerLawyerOrAdmin

from .models import LegalDocument, SignatureRequest
from .serializers import (
    LegalDocumentSerializer,
    SignatureRequestSerializer,
    VerifySignatureSerializer,
)

_REASON_STATUS = {
    "expire": status.HTTP_410_GONE,
    "deja_signe": status.HTTP_409_CONFLICT,
    "trop_d_essais": status.HTTP_429_TOO_MANY_REQUESTS,
    "code_invalide": status.HTTP_400_BAD_REQUEST,
}


class LegalDocumentViewSet(viewsets.ModelViewSet):
    """
    CRUD sur /api/documents/ (GET, POST, PUT, PATCH, DELETE) + upload de fichier.
    Actions signature : request-signature/ et verify-signature/.
    """

    serializer_class = LegalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerLawyerOrAdmin]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_value_regex = r"\d+"

    def get_queryset(self):
        user = self.request.user
        qs = LegalDocument.objects.select_related("company", "company__owner")
        if user.is_platform_admin or user.is_lawyer:
            return qs
        return qs.filter(company__owner=user)

    @extend_schema(
        request=None,
        responses={201: SignatureRequestSerializer},
        description="Genere un code OTP a usage unique pour signer le document.",
    )
    @action(detail=True, methods=["post"], url_path="request-signature")
    def request_signature(self, request, pk=None):
        document = self.get_object()
        if document.status == LegalDocument.Status.SIGNED:
            return Response(
                {"detail": "Document deja signe."},
                status=status.HTTP_409_CONFLICT,
            )
        sig = SignatureRequest.objects.create(document=document)
        # En prod : envoi de sig.otp_code par SMS / e-mail. Ici on l'expose en dev.
        payload = SignatureRequestSerializer(sig).data
        payload["otp_code_debug"] = sig.otp_code
        return Response(payload, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=VerifySignatureSerializer,
        responses={
            200: OpenApiResponse(description="Signature validee, document signe."),
            400: OpenApiResponse(description="Code invalide."),
        },
        description="Verifie le code OTP et passe le document au statut 'signe'.",
    )
    @action(detail=True, methods=["post"], url_path="verify-signature")
    def verify_signature(self, request, pk=None):
        document = self.get_object()
        serializer = VerifySignatureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sig = (
            SignatureRequest.objects.filter(document=document)
            .order_by("-created_at")
            .first()
        )
        if sig is None:
            return Response(
                {"detail": "Aucune demande de signature en cours."},
                status=status.HTTP_404_NOT_FOUND,
            )

        ok, reason = sig.verify(serializer.validated_data["code"])
        if ok:
            return Response(
                {"detail": "Document signe.", "signed_at": sig.signed_at}
            )
        return Response(
            {"detail": reason},
            status=_REASON_STATUS.get(reason, status.HTTP_400_BAD_REQUEST),
        )
