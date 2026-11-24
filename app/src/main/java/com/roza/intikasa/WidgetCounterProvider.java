package com.roza.intikasa;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.SystemClock;
import android.widget.RemoteViews;

/* ويدجت الشاشة الرئيسية: رقم الأيام + عداد بالثواني، من غير أي خدمة في الخلفية.
   الثواني بتعد لوحدها عن طريق Chronometer، ورقم الأيام بيتحدث كل ٣٠ دقيقة وكل مرة التطبيق يفتح أو يتحفظ. */
public class WidgetCounterProvider extends AppWidgetProvider {

    static final String PREFS = "widget_state";

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) update(ctx, mgr, id);
    }

    static void update(Context ctx, AppWidgetManager mgr, int id) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        long startTs = p.getLong("startTs", System.currentTimeMillis());
        int accent;
        try {
            accent = Color.parseColor(p.getString("accent", "#2dd4bf"));
        } catch (Exception e) {
            accent = Color.parseColor("#2dd4bf");
        }

        long elapsed = System.currentTimeMillis() - startTs;
        if (elapsed < 0) elapsed = 0;

        RemoteViews rv = new RemoteViews(ctx.getPackageName(), R.layout.widget_counter);
        rv.setTextViewText(R.id.widget_days, String.valueOf(elapsed / 86400000L));
        rv.setTextColor(R.id.widget_days, accent);
        /* Chronometer يعرض ساعات:دقائق:ثواني جوه اليوم الحالي من العداد ويعد كل ثانية بنفسه */
        long inDay = elapsed % 86400000L;
        rv.setChronometer(R.id.widget_chrono, SystemClock.elapsedRealtime() - inDay, null, true);
        rv.setTextColor(R.id.widget_chrono, accent);

        Intent i = new Intent(ctx, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        rv.setOnClickPendingIntent(R.id.widget_root, pi);

        mgr.updateAppWidget(id, rv);
    }
}
