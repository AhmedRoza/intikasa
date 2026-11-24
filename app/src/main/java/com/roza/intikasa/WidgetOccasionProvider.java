package com.roza.intikasa;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

/* ويدجت المناسبات: كل ويدجت بيعرض المناسبة اللي المستخدم اختارها لما ضافه
   (أو أقرب مناسبة لو اختار التلقائي). الرقم بيتحدث كل ٣٠ دقيقة وكل حفظ من التطبيق.
   مفيش أي خدمة في الخلفية. */
public class WidgetOccasionProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) update(ctx, mgr, id);
    }

    @Override
    public void onDeleted(Context ctx, int[] ids) {
        SharedPreferences p = ctx.getSharedPreferences(WidgetCounterProvider.PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor e = p.edit();
        for (int id : ids) e.remove("occChoice_" + id);
        e.apply();
    }

    static JSONObject pick(SharedPreferences p, int widgetId) {
        try {
            JSONArray arr = new JSONArray(p.getString("occasionsJson", "[]"));
            if (arr.length() == 0) return null;
            String choice = p.getString("occChoice_" + widgetId, "");
            if (!choice.isEmpty()) {
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject o = arr.getJSONObject(i);
                    if (choice.equals(o.optString("id"))) return o;
                }
            }
            // التلقائي: أقرب مناسبة جاية، أو آخر واحدة لو كله فات
            long now = System.currentTimeMillis();
            JSONObject best = null;
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.getJSONObject(i);
                long ts = o.optLong("ts", 0);
                if (best == null) { best = o; continue; }
                long bt = best.optLong("ts", 0);
                if (ts >= now && (bt < now || ts < bt)) best = o;
                else if (bt < now && ts < now && ts > bt) best = o;
            }
            return best;
        } catch (Exception e) {
            return null;
        }
    }

    static void update(Context ctx, AppWidgetManager mgr, int id) {
        SharedPreferences p = ctx.getSharedPreferences(WidgetCounterProvider.PREFS, Context.MODE_PRIVATE);
        JSONObject occ = pick(p, id);

        int accent;
        try {
            accent = Color.parseColor(occ != null ? occ.optString("color", "#2dd4bf") : "#2dd4bf");
        } catch (Exception e) {
            accent = Color.parseColor("#2dd4bf");
        }

        RemoteViews rv = new RemoteViews(ctx.getPackageName(), R.layout.widget_occasion);
        if (occ == null) {
            rv.setViewVisibility(R.id.wocc_days, View.GONE);
            rv.setViewVisibility(R.id.wocc_label, View.GONE);
            rv.setTextViewText(R.id.wocc_name, "مفيش مناسبة لسه");
            rv.setTextColor(R.id.wocc_name, accent);
        } else {
            String name = occ.optString("name", "مناسبة");
            long ts = occ.optLong("ts", 0);
            long left = (ts - System.currentTimeMillis() + 86399999L) / 86400000L;
            rv.setViewVisibility(R.id.wocc_days, View.VISIBLE);
            rv.setViewVisibility(R.id.wocc_label, View.VISIBLE);
            rv.setTextViewText(R.id.wocc_name, name);
            rv.setTextColor(R.id.wocc_name, accent);
            if (left <= 0) {
                rv.setTextViewText(R.id.wocc_days, "🎉");
                rv.setTextViewText(R.id.wocc_label, "المناسبة دخلت!");
            } else {
                rv.setTextViewText(R.id.wocc_days, String.valueOf(left));
                rv.setTextViewText(R.id.wocc_label, left == 1 ? "يوم واحد فاضل" : left == 2 ? "يومين فاضلين" : left <= 10 ? "أيام فاضلة" : "يوم فاضل");
            }
            rv.setTextColor(R.id.wocc_days, accent);
        }

        Intent i = new Intent(ctx, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(ctx, 1, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        rv.setOnClickPendingIntent(R.id.wocc_root, pi);

        mgr.updateAppWidget(id, rv);
    }
}
