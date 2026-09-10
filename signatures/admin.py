from django.contrib import admin
from django.utils.html import format_html

from .models import Signature, Signer


# Register your models here.
@admin.register(Signer)
class SignerAdmin(admin.ModelAdmin):
    list_display = ("name", "signature_path", "signature_image")

    def signature_path(self, obj):
        signature = obj.signature_set.first()

        if not signature:
            return "-"

        return signature.image or "-"

    signature_path.short_description = "Signature Path"

    def signature_image(self, obj):
        signature = obj.signature_set.first()

        if not signature or not signature.image:
            return "Missing signature image"

        image_url = "/" + signature.image

        return format_html(
            '<img src="{}" width="150" height="75" ' 'style="object-fit: contain;">',
            image_url,
        )

    signature_image.short_description = "Signature Image"
