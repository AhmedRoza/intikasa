package com.roza.intikasa;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

/* شاشة اختيار المناسبة لما المستخدم يضيف الويدجت:
   بيعرض كل المناسبات المحفوظة + خيار "أقرب مناسبة تلقائيًا". */
public class WidgetOccasionConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setResult(RESULT_CANCELED);

        widgetId = getIntent().getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                AppWidgetManager.INVALID_APPWIDGET_ID);
        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) { finish(); return; }

        SharedPreferences p = getSharedPreferences(WidgetCounterProvider.PREFS, MODE_PRIVATE);

        ScrollView sv = new ScrollView(this);
        sv.setBackgroundColor(Color.BLACK);
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(18), dp(22), dp(18), dp(22));
        sv.addView(col);

        TextView title = new TextView(this);
        title.setText("اختار المناسبة اللي الويدجت يعرضها");
        title.setTextColor(Color.WHITE);
        title.setTextSize(17f);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        col.addView(title, new LinearLayout.LayoutParams(-1, -2) {{ bottomMargin = dp(16); }});

        // الخيار التلقائي الأول
        col.addView(row("أقرب مناسبة تلقائيًا", "", "#2dd4bf", p));

        try {
            JSONArray arr = new JSONArray(p.getString("occasionsJson", "[]"));
            java.text.SimpleDateFormat fmt = new java.text.SimpleDateFormat("yyyy/MM/dd", java.util.Locale.US);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.getJSONObject(i);
                String label = o.optString("name", "مناسبة") + "  ·  " + fmt.format(new java.util.Date(o.optLong("ts", 0)));
                col.addView(row(label, o.optString("id"), o.optString("color", "#2dd4bf"), p));
            }
        } catch (Exception ignored) {}

        setContentView(sv);
    }

    private View row(String label, String occId, String color, SharedPreferences p) {
        TextView tv = new TextView(this);
        tv.setText(label);
        tv.setTextSize(15f);
        tv.setGravity(Gravity.CENTER);
        tv.setPadding(dp(14), dp(16), dp(14), dp(16));
        int accent;
        try { accent = Color.parseColor(color); } catch (Exception e) { accent = Color.parseColor("#2dd4bf"); }
        tv.setTextColor(accent);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor("#141414"));
        bg.setCornerRadius(dp(14));
        bg.setStroke(dp(1), Color.parseColor("#33ffffff"));
        tv.setBackground(bg);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.bottomMargin = dp(10);
        tv.setLayoutParams(lp);
        tv.setOnClickListener(v -> {
            p.edit().putString("occChoice_" + widgetId, occId).apply();
            AppWidgetManager mgr = AppWidgetManager.getInstance(this);
            WidgetOccasionProvider.update(this, mgr, widgetId);
            Intent out = new Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
            setResult(RESULT_OK, out);
            finish();
        });
        return tv;
    }

    private int dp(int v) { return (int) (v * getResources().getDisplayMetrics().density + .5f); }
}
