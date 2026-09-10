from datetime import datetime, timezone

from django.db import migrations

WEDDING_SLUG = "saidislomxoja_shabbona"


def fix_time_and_address(apps, schema_editor):
    Wedding = apps.get_model("weddings", "Wedding")
    Wedding.objects.filter(slug=WEDDING_SLUG).update(
        # 17:00 Toshkent vaqti (UTC+5, yozgi vaqt yo'q). Avval TIME_ZONE='UTC'
        # paytida "17:00" UTC deb saqlangan edi — saytda 20:00/22:00 chiqardi.
        event_date=datetime(2026, 10, 1, 12, 0, tzinfo=timezone.utc),
        location_address="Toshkent viloyati, Do'stobod shahri",
    )


class Migration(migrations.Migration):
    dependencies = [("weddings", "0001_initial")]

    operations = [
        migrations.RunPython(fix_time_and_address, migrations.RunPython.noop),
    ]
