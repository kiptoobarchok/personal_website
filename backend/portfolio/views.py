
from rest_framework import generics
from .models import Bio, Project
from .serializers import BioSerializer, ProjectSerializer

class BioList(generics.ListAPIView):
	queryset = Bio.objects.all()
	serializer_class = BioSerializer

class ProjectList(generics.ListAPIView):
	queryset = Project.objects.all()
	serializer_class = ProjectSerializer
