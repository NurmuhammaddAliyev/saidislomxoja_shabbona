from rest_framework import serializers
from .models import Wedding, ProgramItem, Guest, LocationPhoto


class LocationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPhoto
        fields = ["id", "image", "order"]


class ProgramItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramItem
        fields = ["id", "time", "title", "icon", "order", "is_final"]


class WeddingPublicSerializer(serializers.ModelSerializer):
    """Mehmonlarga ko'rsatiladigan ochiq ma'lumot — parol va boshqa maxfiy maydonlarsiz."""

    program = ProgramItemSerializer(many=True, read_only=True)
    location_photos = LocationPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Wedding
        fields = [
            "slug", "groom_name", "bride_name", "event_date",
            "quote_text", "quote_source", "cover_photo",
            "intro_greeting", "intro_text", "intro_photo",
            "location_name", "location_address", "location_lat", "location_lng",
            "google_maps_url", "yandex_maps_url", "location_photos",
            "program",
        ]


class GuestSubmitSerializer(serializers.ModelSerializer):
    """Mehmon RSVP formasi orqali yuboradigan ma'lumot."""

    class Meta:
        model = Guest
        fields = ["name", "guest_count", "status", "wish"]

    def validate_guest_count(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Mehmonlar soni 1 dan 5 gacha bo'lishi kerak.")
        return value


class GuestAdminSerializer(serializers.ModelSerializer):
    """Admin panelda jadval uchun to'liq ma'lumot."""

    class Meta:
        model = Guest
        fields = ["id", "name", "guest_count", "status", "wish", "submitted_at"]


class GuestWishPublicSerializer(serializers.ModelSerializer):
    """Mehmonlarga ko'rsatiladigan tilaklar devori uchun — faqat ism va tilak matni."""

    class Meta:
        model = Guest
        fields = ["name", "wish"]


class WeddingStatsSerializer(serializers.Serializer):
    total_guests = serializers.IntegerField()
    confirmed = serializers.IntegerField()
    declined = serializers.IntegerField()
    pending = serializers.IntegerField()


class DashboardPasswordSerializer(serializers.Serializer):
    password = serializers.CharField()
