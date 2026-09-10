from pathlib import Path

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.views.static import serve

from .views import (
    SignatureCreateAPI,
    signature_react_view,
)

DIST_DIR = Path(settings.BASE_DIR) / "frontend" / "dist"

urlpatterns = [
    path(
        "signature/",
        signature_react_view,
        name="signature",
    ),
    path(
        "signature/assets/<path:path>",
        serve,
        {
            "document_root": DIST_DIR / "assets",
        },
    ),
    path(
        "api/signatures/",
        SignatureCreateAPI.as_view(),
        name="signature_create_api",
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)
