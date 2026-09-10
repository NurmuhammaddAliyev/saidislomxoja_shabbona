from django.urls import path
from . import views

urlpatterns = [
    # Mehmonlar uchun
    path("weddings/<slug:slug>/", views.WeddingPublicDetailView.as_view(), name="wedding-detail"),
    path("weddings/<slug:slug>/rsvp/", views.RSVPSubmitView.as_view(), name="wedding-rsvp"),
    path("weddings/<slug:slug>/wishes/", views.WishesPublicListView.as_view(), name="wedding-wishes"),

    # To'y egasi (admin) uchun
    path("weddings/<slug:slug>/dashboard/login/", views.DashboardLoginView.as_view(), name="dashboard-login"),
    path("weddings/<slug:slug>/dashboard/stats/", views.DashboardStatsView.as_view(), name="dashboard-stats"),
    path("weddings/<slug:slug>/dashboard/guests/", views.DashboardGuestListView.as_view(), name="dashboard-guests"),
]
