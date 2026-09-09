from django.test import TestCase
from django.urls import reverse

from .models import Signature, Signer


# Create your tests here.
class SignatureFormPageTests(TestCase):
    def setUp(self):
        self.signature_form_url = reverse("signature_form")

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/signature/")
        self.assertEqual(response.status_code, 200)

    def test_url_available_by_name(self):
        response = self.client.get(self.signature_form_url)
        self.assertEqual(response.status_code, 200)

    def test_template_name_correct(self):
        response = self.client.get(self.signature_form_url)
        self.assertTemplateUsed(response, "signatures/signature_form.html")


class SignatureCreateAPITests(TestCase):
    def setUp(self):
        self.signature_create_api_url = reverse("signature_create_api")

    def test_post_creates_signer_and_signature(self):
        response = self.client.post(
            self.signature_create_api_url,
            {
                "name": "John Doe",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)

        signer = Signer.objects.get(name="John Doe")

        self.assertEqual(Signature.objects.count(), 1)
        self.assertEqual(Signature.objects.first().signer, signer)
