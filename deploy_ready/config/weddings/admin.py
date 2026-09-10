from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import Wedding, ProgramItem, Guest, LocationPhoto


class ProgramItemInline(admin.TabularInline):
    model = ProgramItem
    extra = 1


class LocationPhotoInline(admin.TabularInline):
    model = LocationPhoto
    extra = 1


@admin.register(Wedding)
class WeddingAdmin(admin.ModelAdmin):
    list_display = ["groom_name", "bride_name", "event_date", "slug", "is_active"]
    prepopulated_fields = {"slug": ("groom_name", "bride_name")}
    inlines = [ProgramItemInline, LocationPhotoInline]

    def save_model(self, request, obj, form, change):
        # Parol plain matn kiritilsa, saqlashdan oldin hash qilinadi.
        if "dashboard_password" in form.changed_data:
            obj.dashboard_password = make_password(obj.dashboard_password)
        super().save_model(request, obj, form, change)


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ["name", "wedding", "guest_count", "status", "wish_preview", "submitted_at"]
    list_filter = ["status", "wedding"]
    readonly_fields = ["submitted_at"]

    def wish_preview(self, obj):
        if not obj.wish:
            return "—"
        return obj.wish[:40] + ("..." if len(obj.wish) > 40 else "")
    wish_preview.short_description = "Tilak / izoh"
