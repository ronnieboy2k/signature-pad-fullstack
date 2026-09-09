from django.urls import path
from .views import SignatureFormPageView

urlpatterns = [
    path("signature/", SignatureFormPageView.as_view(), name="signature_form"),
]
