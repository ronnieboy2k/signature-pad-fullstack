from rest_framework import serializers
from .models import Signature, Signer


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

        return Signature.objects.create(
            signer=signer,
            image="123",
        )
