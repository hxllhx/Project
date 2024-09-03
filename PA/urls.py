from django.urls import path
from . import views

urlpatterns = [
    path('', views.PA1),
    path('source/', views.sourcesA),
    path(r'PA/chat/', views.ChatConsumer.as_asgi())
]
