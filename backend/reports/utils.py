import csv
import io
from datetime import timedelta

from django.http import HttpResponse
from django.utils import timezone

from complaints.models import Complaint

PERIODS = {
    "daily": timedelta(days=1),
    "weekly": timedelta(weeks=1),
    "monthly": timedelta(days=30),
    "yearly": timedelta(days=365),
}

FIELDS = [
    "complaint_number", "subject", "status", "district", "tehsil", "area",
    "user__full_name", "created_at", "updated_at",
]
HEADERS = [
    "Complaint Number", "Subject", "Status", "District", "Tehsil", "Area",
    "Citizen", "Created At", "Updated At",
]


def get_report_queryset(period: str):
    qs = Complaint.objects.all().select_related("user")
    if period in PERIODS:
        since = timezone.now() - PERIODS[period]
        qs = qs.filter(created_at__gte=since)
    return qs.order_by("-created_at")


def export_csv(period: str) -> HttpResponse:
    qs = get_report_queryset(period)
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="complaints_report_{period}.csv"'
    writer = csv.writer(response)
    writer.writerow(HEADERS)
    for row in qs.values_list(*FIELDS):
        writer.writerow(row)
    return response


def export_excel(period: str) -> HttpResponse:
    from openpyxl import Workbook

    qs = get_report_queryset(period)
    wb = Workbook()
    ws = wb.active
    ws.title = f"{period.capitalize()} Report"
    ws.append(HEADERS)
    for row in qs.values_list(*FIELDS):
        ws.append([str(v) if v is not None else "" for v in row])

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    response = HttpResponse(
        buffer.read(),
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    response["Content-Disposition"] = f'attachment; filename="complaints_report_{period}.xlsx"'
    return response


def export_pdf(period: str) -> HttpResponse:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import landscape, A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
    from reportlab.lib.styles import getSampleStyleSheet

    qs = get_report_queryset(period)
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
    styles = getSampleStyleSheet()

    data = [HEADERS] + [
        [str(v) if v is not None else "" for v in row] for row in qs.values_list(*FIELDS)
    ]
    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E7D32")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
    ]))

    title = Paragraph(f"Smart Waste Complaint Report - {period.capitalize()}", styles["Title"])
    doc.build([title, table])
    buffer.seek(0)

    response = HttpResponse(buffer.read(), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="complaints_report_{period}.pdf"'
    return response
