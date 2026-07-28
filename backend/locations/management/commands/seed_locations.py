"""
Seeds the Punjab location hierarchy (Province -> Division -> District -> Tehsil -> Area).

Only Divisions are fully specified in the FYDP spec; District/Tehsil/Area are
seeded with representative starter data for each division so the dynamic
dropdowns are populated end-to-end. Admins can extend this via the
Location API or Django admin.

Usage: python manage.py seed_locations
"""
from django.core.management.base import BaseCommand
from locations.models import Province, Division, District, Tehsil, Area

PUNJAB_DATA = {
    "Lahore": {
        "Lahore": {"Model Town": ["Model Town A", "Model Town B"], "Shalimar": ["Baghbanpura", "Mughalpura"]},
        "Kasur": {"Kasur": ["Kasur City", "Chunian Road"], "Chunian": ["Chunian City"]},
        "Sheikhupura": {"Sheikhupura": ["Sheikhupura City"], "Muridke": ["Muridke City"]},
        "Nankana Sahib": {"Nankana Sahib": ["Nankana City"]},
    },
    "Bahawalpur": {
        "Bahawalpur": {"Bahawalpur City": ["Model Town Bahawalpur", "Satellite Town"], "Hasilpur": ["Hasilpur City"]},
        "Bahawalnagar": {"Bahawalnagar": ["Bahawalnagar City"], "Chishtian": ["Chishtian City"]},
        "Rahim Yar Khan": {"Rahim Yar Khan": ["RYK City"], "Sadiqabad": ["Sadiqabad City"]},
    },
    "Multan": {
        "Multan": {"Multan City": ["Cantt", "Shah Rukn-e-Alam"], "Shujabad": ["Shujabad City"]},
        "Khanewal": {"Khanewal": ["Khanewal City"]},
        "Vehari": {"Vehari": ["Vehari City"]},
        "Lodhran": {"Lodhran": ["Lodhran City"]},
    },
    "Rawalpindi": {
        "Rawalpindi": {"Rawalpindi City": ["Saddar", "Satellite Town Rwp"], "Gujar Khan": ["Gujar Khan City"]},
        "Attock": {"Attock": ["Attock City"]},
        "Jhelum": {"Jhelum": ["Jhelum City"]},
        "Chakwal": {"Chakwal": ["Chakwal City"]},
    },
    "Faisalabad": {
        "Faisalabad": {"Faisalabad City": ["Madina Town", "Jaranwala Road"], "Jaranwala": ["Jaranwala City"]},
        "Toba Tek Singh": {"Toba Tek Singh": ["TT Singh City"]},
        "Chiniot": {"Chiniot": ["Chiniot City"]},
    },
    "Gujranwala": {
        "Gujranwala": {"Gujranwala City": ["Model Town Gujranwala"], "Wazirabad": ["Wazirabad City"]},
        "Sialkot": {"Sialkot": ["Sialkot City"]},
        "Gujrat": {"Gujrat": ["Gujrat City"]},
        "Hafizabad": {"Hafizabad": ["Hafizabad City"]},
        "Narowal": {"Narowal": ["Narowal City"]},
    },
    "Sargodha": {
        "Sargodha": {"Sargodha City": ["Satellite Town Sargodha"]},
        "Khushab": {"Khushab": ["Khushab City"]},
        "Mianwali": {"Mianwali": ["Mianwali City"]},
        "Bhakkar": {"Bhakkar": ["Bhakkar City"]},
    },
    "Sahiwal": {
        "Sahiwal": {"Sahiwal City": ["Sahiwal City Center"]},
        "Okara": {"Okara": ["Okara City"]},
        "Pakpattan": {"Pakpattan": ["Pakpattan City"]},
    },
    "Dera Ghazi Khan": {
        "Dera Ghazi Khan": {"DG Khan City": ["DG Khan City Center"]},
        "Rajanpur": {"Rajanpur": ["Rajanpur City"]},
        "Layyah": {"Layyah": ["Layyah City"]},
        "Muzaffargarh": {"Muzaffargarh": ["Muzaffargarh City"]},
    },
}


class Command(BaseCommand):
    help = "Seed the Punjab province/division/district/tehsil/area hierarchy"

    def handle(self, *args, **options):
        province, _ = Province.objects.get_or_create(name="Punjab")
        for division_name, districts in PUNJAB_DATA.items():
            division, _ = Division.objects.get_or_create(province=province, name=division_name)
            for district_name, tehsils in districts.items():
                district, _ = District.objects.get_or_create(division=division, name=district_name)
                for tehsil_name, areas in tehsils.items():
                    tehsil, _ = Tehsil.objects.get_or_create(district=district, name=tehsil_name)
                    for area_name in areas:
                        Area.objects.get_or_create(tehsil=tehsil, name=area_name)
        self.stdout.write(self.style.SUCCESS("Punjab location hierarchy seeded successfully."))
