from django.views.generic import TemplateView


# Create your views here.
class SignatureFormPageView(TemplateView):
    template_name = "signatures/signature_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context
