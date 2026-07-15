from django.contrib import admin
from .models import Complaint, ComplaintImage, ComplaintTimeline, Comment, Feedback, ComplaintCounter

admin.site.register(Complaint)
admin.site.register(ComplaintImage)
admin.site.register(ComplaintTimeline)
admin.site.register(Comment)
admin.site.register(Feedback)
admin.site.register(ComplaintCounter)
