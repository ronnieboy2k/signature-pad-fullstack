from rest_framework import serializers
from .models import Signature, Signer
from .services.signature import save_signature_image


class SignatureSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    signature = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Signature
        fields = ["id", "name", "signature", "date"]
        read_only_fields = ["id", "image", "date"]

    def create(self, validated_data):
        name = validated_data.pop("name")
        encoded_signature = validated_data.pop("signature", "")

        signer = Signer.objects.create(
            name=name,
        )

        image = save_signature_image(name, encoded_signature)

        return Signature.objects.create(
            signer=signer,
            image=image,
        )
