from rest_framework import permissions, viewsets

from .models import Company
from .permissions import IsOwnerLawyerOrAdmin
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """CRUD complet sur /api/companies/ (GET, POST, PUT, PATCH, DELETE)."""

    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerLawyerOrAdmin]
    lookup_value_regex = r"\d+"

    def get_queryset(self):
        user = self.request.user
        qs = Company.objects.select_related("owner")
        if user.is_platform_admin or user.is_lawyer:
            return qs
        return qs.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
