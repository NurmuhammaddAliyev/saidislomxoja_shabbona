from django.core import signing
from django.core.signing import BadSignature, SignatureExpired
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Wedding, Guest
from .serializers import (
    WeddingPublicSerializer,
    GuestSubmitSerializer,
    GuestAdminSerializer,
    GuestWishPublicSerializer,
    WeddingStatsSerializer,
    DashboardPasswordSerializer,
)

DASHBOARD_TOKEN_SALT = "wedding-dashboard"
DASHBOARD_TOKEN_MAX_AGE = 60 * 60 * 4  # 4 soat


# ---------- Mehmonlar uchun ochiq API ----------

class WeddingPublicDetailView(generics.RetrieveAPIView):
    """GET /api/weddings/<slug>/ — taklifnoma sahifasi uchun barcha ma'lumot."""

    queryset = Wedding.objects.filter(is_active=True)
    serializer_class = WeddingPublicSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]


class RSVPSubmitView(APIView):
    """POST /api/weddings/<slug>/rsvp/ — mehmon formani yuboradi."""

    permission_classes = [AllowAny]

    def post(self, request, slug):
        wedding = get_object_or_404(Wedding, slug=slug, is_active=True)
        serializer = GuestSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(wedding=wedding)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WishesPublicListView(APIView):
    """GET /api/weddings/<slug>/wishes/ — mehmonlarga ko'rinadigan tilaklar devori.

    Faqat bo'sh bo'lmagan (wish yozilgan) va "keladi" deb belgilangan
    mehmonlarning tilaklari qaytariladi — shaxsiy ma'lumot (mehmonlar soni,
    holat) chiqarilmaydi.
    """

    permission_classes = [AllowAny]

    def get(self, request, slug):
        wedding = get_object_or_404(Wedding, slug=slug, is_active=True)
        guests = (
            wedding.guests
            .filter(status=Guest.Status.COMING)
            .exclude(wish="")
            .order_by("-submitted_at")
        )
        return Response(GuestWishPublicSerializer(guests, many=True).data)


# ---------- To'y egasi (admin panel) uchun ----------

class DashboardLoginView(APIView):
    """POST /api/weddings/<slug>/dashboard/login/ — parolni tekshirib token beradi."""

    permission_classes = [AllowAny]

    def post(self, request, slug):
        wedding = get_object_or_404(Wedding, slug=slug)
        serializer = DashboardPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entered = serializer.validated_data["password"]
        if not check_password(entered, wedding.dashboard_password):
            return Response({"detail": "Parol noto'g'ri."}, status=status.HTTP_401_UNAUTHORIZED)

        token = signing.dumps({"slug": wedding.slug}, salt=DASHBOARD_TOKEN_SALT)
        return Response({"token": token})


def _verify_dashboard_token(request, slug):
    token = request.headers.get("X-Dashboard-Token", "")
    try:
        data = signing.loads(token, salt=DASHBOARD_TOKEN_SALT, max_age=DASHBOARD_TOKEN_MAX_AGE)
    except (BadSignature, SignatureExpired):
        return False
    return data.get("slug") == slug


class DashboardStatsView(APIView):
    """GET /api/weddings/<slug>/dashboard/stats/ — statistika kartalari uchun."""

    permission_classes = [AllowAny]

    def get(self, request, slug):
        if not _verify_dashboard_token(request, slug):
            return Response({"detail": "Ruxsat yo'q."}, status=status.HTTP_401_UNAUTHORIZED)

        wedding = get_object_or_404(Wedding, slug=slug)
        guests = wedding.guests.all()
        data = {
            "total_guests": sum(g.guest_count for g in guests),
            "confirmed": guests.filter(status=Guest.Status.COMING).count(),
            "declined": guests.filter(status=Guest.Status.NOT_COMING).count(),
            "pending": guests.filter(status=Guest.Status.PENDING).count(),
        }
        return Response(WeddingStatsSerializer(data).data)


class DashboardGuestListView(APIView):
    """GET /api/weddings/<slug>/dashboard/guests/ — to'liq mehmonlar jadvali."""

    permission_classes = [AllowAny]

    def get(self, request, slug):
        if not _verify_dashboard_token(request, slug):
            return Response({"detail": "Ruxsat yo'q."}, status=status.HTTP_401_UNAUTHORIZED)

        wedding = get_object_or_404(Wedding, slug=slug)
        guests = wedding.guests.all()
        return Response(GuestAdminSerializer(guests, many=True).data)
