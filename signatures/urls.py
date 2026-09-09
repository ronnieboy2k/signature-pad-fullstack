from django.urls import path
from .views import SignatureFormPageView
from .views import SignatureCreateAPI

urlpatterns = [
    path("signature/", SignatureFormPageView.as_view(), name="signature_form"),
    path("api/signatures/", SignatureCreateAPI.as_view(), name="signature_create_api"),
]
