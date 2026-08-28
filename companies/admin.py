from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "legal_form", "status", "owner", "created_at")
    list_filter = ("legal_form", "status")
    search_fields = ("name", "owner__email")
