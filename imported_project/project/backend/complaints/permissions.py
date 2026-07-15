from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrStaff(BasePermission):
    """Citizens may only view/act on their own complaints.
    Admin/Manager/Worker roles have elevated access enforced at the view level."""

    def has_object_permission(self, request, view, obj):
        if request.user.role in ("admin", "manager", "worker"):
            return True
        return obj.user_id == request.user.id
