from django.test import TestCase
from django.urls import reverse

from .models import Signature, Signer

import base64
from datetime import datetime
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from .services.signature import (
    clean_name_to_filename,
    create_signature_directory,
    get_signature_directory,
    get_unique_signature_filename,
    save_signature_image,
)


# Create your tests here.
class SignatureFormPageTests(TestCase):
    def setUp(self):
        self.signature_form_url = reverse("signature")

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/signature/")
        self.assertEqual(response.status_code, 200)

    def test_url_available_by_name(self):
        response = self.client.get(self.signature_form_url)
        self.assertEqual(response.status_code, 200)

    def test_react_frontend_is_served(self):
        response = self.client.get(self.signature_form_url)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<div id="root"></div>')


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

    def test_creates_signature_with_image(self):
        image_data = b"test image data"
        encoded_data = "data:image/png;base64," + base64.b64encode(image_data).decode(
            "ascii"
        )

        response = self.client.post(
            reverse("signature_create_api"),
            {
                "name": "John Doe",
                "signature": encoded_data,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)

        signature = Signature.objects.get()

        self.assertTrue(signature.image)
        self.assertTrue(signature.image.endswith("/john-doe.png"))


class CleanNameToFilenameTests(TestCase):
    def test_clean_name_to_filename(self):
        result = clean_name_to_filename("John Doe")

        self.assertEqual(result, "john-doe.png")

    def test_converts_spaces_to_dash(self):
        result = clean_name_to_filename("John    Doe")

        self.assertEqual(result, "john-doe.png")

    def test_converts_special_characters_to_dash(self):
        result = clean_name_to_filename("John @ Doe!")

        self.assertEqual(result, "john-doe.png")

    def test_converts_to_lowercase(self):
        result = clean_name_to_filename("JOHN DOE")

        self.assertEqual(result, "john-doe.png")

    def test_removes_extra_dashes(self):
        result = clean_name_to_filename("John---Doe")

        self.assertEqual(result, "john-doe.png")

    def test_removes_accents(self):
        result = clean_name_to_filename("José María")

        self.assertEqual(result, "jose-maria.png")

    def test_removes_leading_and_trailing_dashes(self):
        result = clean_name_to_filename(" - John Doe - ")

        self.assertEqual(result, "john-doe.png")


class GetSignatureDirectoryTests(TestCase):
    def test_returns_date_based_signature_directory(self):
        now = datetime.now()

        expected = (
            f"media/signatures/" f"{now.year}/" f"{now.month:02d}/" f"{now.day:02d}"
        )

        result = get_signature_directory()

        self.assertEqual(result, expected)


class GetUniqueSignatureFilenameTests(TestCase):
    def test_returns_filename_when_not_existing(self):
        result = get_unique_signature_filename("john-doe.png")

        self.assertEqual(
            result,
            f"media/signatures/"
            f"{datetime.now().year}/"
            f"{datetime.now().month:02d}/"
            f"{datetime.now().day:02d}/"
            f"john-doe.png",
        )

    def test_adds_suffix_when_filename_exists(self):
        Signature.objects.create(
            signer=Signer.objects.create(name="John Doe"),
            image=(
                f"media/signatures/"
                f"{datetime.now().year}/"
                f"{datetime.now().month:02d}/"
                f"{datetime.now().day:02d}/"
                f"john-doe.png"
            ),
        )

        result = get_unique_signature_filename("john-doe.png")

        self.assertTrue(result.endswith("john-doe-1.png"))

    def test_uses_first_available_suffix(self):
        directory = get_signature_directory()

        signer = Signer.objects.create(name="John Doe")

        Signature.objects.create(
            signer=signer,
            image=f"{directory}/john-doe.png",
        )

        Signature.objects.create(
            signer=signer,
            image=f"{directory}/john-doe-1.png",
        )

        Signature.objects.create(
            signer=signer,
            image=f"{directory}/john-doe-3.png",
        )

        result = get_unique_signature_filename("john-doe.png")

        self.assertEqual(
            result,
            f"{directory}/john-doe-2.png",
        )


class CreateSignatureDirectoryTests(TestCase):
    def test_creates_signature_directory(self):
        with TemporaryDirectory() as temp_directory:
            with patch(
                "signatures.services.signature.BASE_DIR",
                Path(temp_directory),
            ):
                directory = create_signature_directory()

                self.assertTrue(directory.exists())
                self.assertTrue(directory.is_dir())

    def test_does_not_fail_when_directory_already_exists(self):
        with TemporaryDirectory() as temp_directory:
            with patch(
                "signatures.services.signature.BASE_DIR",
                Path(temp_directory),
            ):
                first_directory = create_signature_directory()
                second_directory = create_signature_directory()

                self.assertEqual(first_directory, second_directory)
                self.assertTrue(second_directory.exists())


class SaveSignatureImageTests(TestCase):
    def test_saves_signature_image(self):
        image_data = b"test image data"
        encoded_data = "data:image/png;base64," + base64.b64encode(image_data).decode(
            "ascii"
        )

        with TemporaryDirectory() as temp_directory:
            with patch(
                "signatures.services.signature.BASE_DIR",
                Path(temp_directory),
            ):
                result = save_signature_image(
                    "John Doe",
                    encoded_data,
                )

                file_path = Path(temp_directory) / result

                self.assertEqual(
                    result,
                    f"media/signatures/"
                    f"{datetime.now().year}/"
                    f"{datetime.now().month:02d}/"
                    f"{datetime.now().day:02d}/"
                    f"john-doe.png",
                )

                self.assertTrue(file_path.exists())
                self.assertEqual(file_path.read_bytes(), image_data)

    def test_returns_empty_string_without_signature_data(self):
        result = save_signature_image("John Doe", "")

        self.assertEqual(result, "")
