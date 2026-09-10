import base64
from pathlib import Path
import re
import unicodedata

from datetime import datetime

from signatures.models import Signature

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def clean_name_to_filename(name):
    name = unicodedata.normalize("NFKD", name)
    name = name.encode("ascii", "ignore").decode("ascii")

    name = name.strip().lower()
    name = re.sub(r"\s+", "-", name)
    name = re.sub(r"[^a-z0-9-]", "-", name)
    name = re.sub(r"-+", "-", name)
    name = name.strip("-")

    return f"{name}.png"


def get_signature_directory():
    now = datetime.now()

    return f"media/signatures/" f"{now.year}/" f"{now.month:02d}/" f"{now.day:02d}"


def get_unique_signature_filename(filename):
    now = datetime.now()

    directory = get_signature_directory()

    base_filename = filename.rsplit(".", 1)[0]
    extension = filename.rsplit(".", 1)[-1]

    filename = f"{directory}/{base_filename}.{extension}"

    if not Signature.objects.filter(image=filename).exists():
        return filename

    counter = 1

    while True:
        new_filename = f"{directory}/{base_filename}-{counter}.{extension}"

        if not Signature.objects.filter(image=new_filename).exists():
            return new_filename

        counter += 1


def create_signature_directory():
    now = datetime.now()

    directory = BASE_DIR / get_signature_directory()

    directory.mkdir(parents=True, exist_ok=True)

    return directory


def save_signature_image(name, encoded_data):

    result = ""

    if encoded_data:

        filename = clean_name_to_filename(name)
        filename = get_unique_signature_filename(filename)
        filename2 = BASE_DIR / filename

        encoded_data = encoded_data.split(",", 1)[-1]
        image_data = base64.b64decode(encoded_data)

        create_signature_directory()

        with filename2.open("wb") as file:
            file.write(image_data)
            result = filename

    return result
