from django.contrib import admin
from .models import Signature, Signer


# Register your models here.
@admin.register(Signer)
class SignerAdmin(admin.ModelAdmin):
    list_display = ("name", "signature_path")

    def signature_path(self, obj):
        signature = obj.signature_set.first()

        if not signature:
            return "-"

        return signature.image or "-"

    signature_path.short_description = "Signature"
