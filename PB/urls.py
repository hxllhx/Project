from django.urls import path
from . import views

urlpatterns = [
    path('', views.PB1),
    path('source/', views.sourcesB),
]
