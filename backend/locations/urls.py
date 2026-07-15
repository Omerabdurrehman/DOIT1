from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("provinces", views.ProvinceViewSet)
router.register("divisions", views.DivisionViewSet)
router.register("districts", views.DistrictViewSet)
router.register("tehsils", views.TehsilViewSet)
router.register("areas", views.AreaViewSet)

urlpatterns = router.urls
