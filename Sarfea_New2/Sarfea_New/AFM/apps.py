from django.apps import AppConfig
from django import template


class AfmConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "AFM"

    def ready(self):
        import AFM.signals  # Burada signals.py dosyanızın tanıtılması
        from .templatetags import custom_filters  # Import your custom filters
        register = template.Library()
        register.filter('basename', custom_filters.basename)  # Example filter registration