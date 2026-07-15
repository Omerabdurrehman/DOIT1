from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Complaint, ComplaintStatus
from notifications.models import Notification


@receiver(post_save, sender=Complaint)
def notify_on_complaint_created(sender, instance, created, **kwargs):
    if created:
        # Notify all Admins of the new complaint (spec: "Admin receives notification")
        from accounts.models import User, Role
        admins = User.objects.filter(role=Role.ADMIN)
        Notification.objects.bulk_create([
            Notification(
                user=admin,
                title="New Complaint Submitted",
                message=f"Complaint {instance.complaint_number} was submitted by {instance.user.full_name}.",
            )
            for admin in admins
        ])
