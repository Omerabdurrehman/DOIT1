from django.conf import settings
from django.db import models
from complaints.models import Complaint


class Assignment(models.Model):
    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name="assignment")
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="manager_assignments", limit_choices_to={"role": "manager"},
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="worker_assignments", limit_choices_to={"role": "worker"},
    )
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    worker_remarks = models.TextField(blank=True)

    class Meta:
        ordering = ["-assigned_at"]

    def __str__(self):
        return f"Assignment for {self.complaint.complaint_number}"
