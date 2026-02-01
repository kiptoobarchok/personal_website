from django.urls import path
from .views import BioList, ProjectList

urlpatterns = [
    path('bio/', BioList.as_view(), name='bio-list'),
    path('projects/', ProjectList.as_view(), name='project-list'),
]
