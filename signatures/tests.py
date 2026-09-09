from django.test import SimpleTestCase
from django.urls import reverse


# Create your tests here.
class SignatureFormPageTests(SimpleTestCase):
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
