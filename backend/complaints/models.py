from django.conf import settings
from django.db import models, transaction
from django.utils import timezone


class ComplaintStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    ACKNOWLEDGED = "acknowledged", "Acknowledged"
    ASSIGNED = "assigned", "Assigned"
    IN_PROGRESS = "in_progress", "In Progress"
    RESOLVED = "resolved", "Resolved"
    WAITING_VERIFICATION = "waiting_verification", "Waiting For Verification"
    CLOSED = "closed", "Closed"
    REOPENED = "reopened", "Reopened"
    REJECTED = "rejected", "Rejected"


class TimelineEvent(models.TextChoices):
    CREATED = "created", "Complaint Created"
    ACKNOWLEDGED = "acknowledged", "Acknowledged"
    ASSIGNED = "assigned", "Assigned"
    WORK_STARTED = "work_started", "Work Started"
    WORK_COMPLETED = "work_completed", "Work Completed"
    REVIEWED = "reviewed", "Reviewed"
    VERIFIED = "verified", "Verified"
    CLOSED = "closed", "Closed"
    REOPENED = "reopened", "Reopened"
    REJECTED = "rejected", "Rejected"


class ComplaintCounter(models.Model):
    """Keeps a per-year counter so tracking numbers are gapless & sequential:
    PUN-<year>-000001, PUN-<year>-000002, ..."""
    year = models.IntegerField(unique=True)
    last_number = models.IntegerField(default=0)

    @classmethod
    def next_tracking_number(cls, prefix="PUN"):
        year = timezone.now().year
        with transaction.atomic():
            counter, _ = cls.objects.select_for_update().get_or_create(year=year)
            counter.last_number += 1
            counter.save()
            return f"{prefix}-{year}-{counter.last_number:06d}"


class Complaint(models.Model):
    complaint_number = models.CharField(max_length=30, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="complaints")

    subject = models.CharField(max_length=255)
    description = models.TextField()

    province = models.CharField(max_length=100, default="Punjab")
    division = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    tehsil = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, blank=True)

    status = models.CharField(max_length=30, choices=ComplaintStatus.choices, default=ComplaintStatus.PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.complaint_number:
            self.complaint_number = ComplaintCounter.next_tracking_number()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.complaint_number


class ComplaintImage(models.Model):
    class ImageType(models.TextChoices):
        BEFORE = "before", "Before"
        AFTER = "after", "After"
        PROGRESS = "progress", "Progress"

    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="complaints/%Y/%m/")
    image_type = models.CharField(max_length=20, choices=ImageType.choices, default=ImageType.BEFORE)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class ComplaintTimeline(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="timeline")
    event = models.CharField(max_length=30, choices=TimelineEvent.choices)
    note = models.CharField(max_length=255, blank=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class Comment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class Feedback(models.Model):
    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name="feedback")
    rating = models.PositiveSmallIntegerField()  # 1-5
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
