from rest_framework import permissions


class IsOwnerLawyerOrAdmin(permissions.BasePermission):
    """
    Object-level access:
    - admin / juriste : acces total
    - client : uniquement ses propres objets (via .owner)
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_platform_admin or user.is_lawyer:
            return True
        owner = getattr(obj, "owner", None) or getattr(
            getattr(obj, "company", None), "owner", None
        )
        return owner == user
