from rest_framework import serializers
from .models import Bio, Project

class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
