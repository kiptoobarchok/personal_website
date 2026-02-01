
from django.db import models

class Bio(models.Model):
	name = models.CharField(max_length=100)
	summary = models.TextField()

	def __str__(self):
		return self.name

class Project(models.Model):
	title = models.CharField(max_length=100)
	description = models.TextField()
	url = models.URLField(blank=True)

	def __str__(self):
		return self.title
