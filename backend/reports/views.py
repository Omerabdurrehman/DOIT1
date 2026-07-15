from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .utils import export_csv, export_excel, export_pdf, PERIODS


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class GenerateReportView(APIView):
    """
    GET /api/reports/generate/?period=daily|weekly|monthly|yearly&file_type=pdf|excel|csv

    NOTE: the export format is deliberately named "file_type", not "format" —
    DRF's default content negotiation reserves the "format" query parameter
    for its own renderer-selection mechanism (e.g. ?format=json), and reusing
    it here would cause DRF to raise Http404 for any value it doesn't
    recognize as a registered renderer suffix (such as "pdf" or "excel").
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        period = request.query_params.get("period", "monthly")
        file_type = request.query_params.get("file_type", "csv")

        if period not in PERIODS:
            return Response({"detail": f"period must be one of {list(PERIODS)}"}, status=status.HTTP_400_BAD_REQUEST)

        if file_type == "pdf":
            return export_pdf(period)
        if file_type == "excel":
            return export_excel(period)
        if file_type == "csv":
            return export_csv(period)
        return Response({"detail": "file_type must be one of pdf, excel, csv"}, status=status.HTTP_400_BAD_REQUEST)
