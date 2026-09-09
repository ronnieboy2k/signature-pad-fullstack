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
