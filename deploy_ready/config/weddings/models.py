from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Wedding(models.Model):
    """Bitta to'y taklifnomasi. owner = shu taklifnomani boshqaradigan to'y egasi."""

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="weddings")
    slug = models.SlugField(unique=True, help_text="URL uchun: /wedding/<slug>/")

    # Kirish sahifasi
    groom_name = models.CharField(max_length=100, verbose_name="Kuyov ismi")
    bride_name = models.CharField(max_length=100, verbose_name="Kelin ismi")
    event_date = models.DateTimeField(verbose_name="To'y sanasi va vaqti")
    quote_text = models.TextField(blank=True, verbose_name="Oyat/hadis matni")
    quote_source = models.CharField(max_length=150, blank=True, verbose_name="Oyat manbasi")
    cover_photo = models.ImageField(upload_to="weddings/covers/", blank=True, null=True)

    # "Biz" bo'limi
    intro_greeting = models.CharField(
        max_length=200, blank=True, default="QADRLI AZIZLARIMIZ!"
    )
    intro_text = models.TextField(blank=True, verbose_name="Taklif matni")
    intro_photo = models.ImageField(upload_to="weddings/intro/", blank=True, null=True)

    # O'tkazilish joyi
    location_name = models.CharField(max_length=150, blank=True, verbose_name="Restoran nomi")
    location_address = models.TextField(blank=True, verbose_name="To'liq manzil")
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)
    google_maps_url = models.URLField(blank=True)
    yandex_maps_url = models.URLField(blank=True)

    # Admin panelga kirish paroli (to'y egasi uchun)
    dashboard_password = models.CharField(
        max_length=128, verbose_name="Admin panel paroli",
        help_text="To'y egasi mehmonlar ro'yxatini ko'rish uchun kiritadigan parol"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "To'y taklifnomasi"
        verbose_name_plural = "To'y taklifnomalari"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.groom_name} & {self.bride_name} ({self.event_date:%d.%m.%Y})"

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.groom_name}-{self.bride_name}")
            self.slug = base
        super().save(*args, **kwargs)

    @property
    def location_photos(self):
        return self.location_images.all()


class LocationPhoto(models.Model):
    """O'tkazilish joyi bo'limidagi galereya rasmlari (bino, zal ichki ko'rinishi va h.k.)."""

    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name="location_images")
    image = models.ImageField(upload_to="weddings/location/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class ProgramItem(models.Model):
    """Dastur bo'limidagi bitta qator: 18:00 - Mehmonlar yig'ilishi va h.k."""

    ICON_CHOICES = [
        ("drink", "Bokal"),
        ("rings", "Uzuklar"),
        ("food", "Taom"),
        ("fireworks", "Salyut"),
    ]

    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name="program")
    time = models.TimeField()
    title = models.CharField(max_length=150)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="drink")
    order = models.PositiveIntegerField(default=0)
    is_final = models.BooleanField(default=False, help_text="Oxirgi nuqta (masalan Yakuni)")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.time} - {self.title}"


class Guest(models.Model):
    """RSVP orqali mehmon tomonidan yuborilgan javob."""

    class Status(models.TextChoices):
        PENDING = "pending", "Kutilmoqda"
        COMING = "coming", "Keladi"
        NOT_COMING = "not_coming", "Kela olmaydi"

    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name="guests")
    name = models.CharField(max_length=100, verbose_name="Mehmon ismi")
    guest_count = models.PositiveSmallIntegerField(default=1, verbose_name="Mehmonlar soni")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    wish = models.TextField(blank=True, verbose_name="Tilak / izoh")
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]
        verbose_name = "Mehmon"
        verbose_name_plural = "Mehmonlar"

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

