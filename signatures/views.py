from pathlib import Path

from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import FileResponse
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView

from .models import Signature
from .serializers import SignatureSerializer


# Create your views here.
class SignatureFormPageView(TemplateView):
    template_name = "signatures/signature_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context


class SignatureCreateAPI(CreateAPIView):
    queryset = Signature.objects.all()
    serializer_class = SignatureSerializer


@ensure_csrf_cookie
def signature_react_view(request):
    dist_path = Path(settings.BASE_DIR) / "frontend" / "dist" / "index.html"

    return FileResponse(
        dist_path.open("rb"),
        content_type="text/html",
    )
