from django.contrib import admin
from django.urls import path
from django.views.static import serve
from django.conf import settings
from . import views





urlpatterns = [
    path("", views.login_request, name='login'),
    path("login/", views.login_request, name='login'),
    path("logout", views.logout_request, name='logout'),


]