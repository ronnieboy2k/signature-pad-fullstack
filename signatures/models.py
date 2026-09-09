from django.db import models


# Create your models here.
class Signer(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True)


class Signature(models.Model):
    signer = models.ForeignKey(Signer, on_delete=models.CASCADE)
    image = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
