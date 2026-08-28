from rest_framework.routers import DefaultRouter

from .views import LegalDocumentViewSet

router = DefaultRouter()
router.register(r"documents", LegalDocumentViewSet, basename="document")

urlpatterns = router.urls
