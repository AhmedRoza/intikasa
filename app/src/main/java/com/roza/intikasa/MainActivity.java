package com.roza.intikasa;

import android.app.Activity;
import android.content.ComponentName;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.hardware.biometrics.BiometricPrompt;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private WebView web;
    private ValueCallback<Uri[]> fileCb;
    private final Handler ui = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);
        // إذن الكتابة في Downloads للنسخة الاحتياطية (أندرويد 9 وأقدم بس)
        if (Build.VERSION.SDK_INT >= 23 && Build.VERSION.SDK_INT <= 28
                && checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 42);
        }
        web = new WebView(this);
        WebSettings ws = web.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setAllowFileAccess(true);
        web.setBackgroundColor(Color.BLACK);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView w, ValueCallback<Uri[]> cb, FileChooserParams params) {
                fileCb = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                String[] acc = params.getAcceptTypes();
                boolean imagesOnly = acc != null && acc.length > 0 && acc[0].startsWith("image/");
                i.setType(imagesOnly ? "image/*" : "*/*");
                startActivityForResult(Intent.createChooser(i, "اختار ملف"), 9001);
                return true;
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req == 9001 && fileCb != null) {
            Uri uri = (res == RESULT_OK && data != null) ? data.getData() : null;
            fileCb.onReceiveValue(uri != null ? new Uri[]{uri} : null);
            fileCb = null;
        } else if (req == 9002) {
            // storage permission result returns here on old APIs via startActivityForResult? no-op
        }
    }

    private void toast(final String msg) {
        ui.post(() -> Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show());
    }

    private void jsCallback(final String js) {
        ui.post(() -> web.evaluateJavascript(js, null));
    }

    class Bridge {
        @JavascriptInterface
        public void exitApp() {
            ui.post(() -> finishAffinity());
        }

        /* فحص التحديث: طلب واحد لـ GitHub API من الكود الأصلي — الويب فيو نفسه مبيتصلش بالنت خالص */
        @JavascriptInterface
        public void checkUpdate() {
            new Thread(() -> {
                String result;
                try {
                    java.net.HttpURLConnection c = (java.net.HttpURLConnection)
                            new java.net.URL("https://api.github.com/repos/AhmedRoza/intikasa/releases/latest").openConnection();
                    c.setRequestProperty("Accept", "application/vnd.github+json");
                    c.setRequestProperty("User-Agent", "intikasa-android");
                    c.setConnectTimeout(12000);
                    c.setReadTimeout(12000);
                    if (c.getResponseCode() == 200) {
                        java.util.Scanner sc = new java.util.Scanner(c.getInputStream(), "UTF-8").useDelimiter("\\A");
                        String body = sc.hasNext() ? sc.next() : "";
                        java.util.regex.Matcher m = java.util.regex.Pattern
                                .compile("\"tag_name\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
                        String tag = m.find() ? m.group(1) : "";
                        result = "{\"ok\":true,\"tag\":\"" + tag + "\"}";
                    } else {
                        result = "{\"ok\":false}";
                    }
                    c.disconnect();
                } catch (Exception e) {
                    result = "{\"ok\":false}";
                }
                jsCallback("window.__updResult && __updResult(" + result + ")");
            }).start();
        }

        @JavascriptInterface
        public void saveBackup(final String json, final String filename) {
            // بنحفظ النسخة في مجلد Downloads العام عشان يقدر يلاقيها من أي مدير ملفات
            try {
                byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
                if (Build.VERSION.SDK_INT >= 29) {
                    android.content.ContentValues v = new android.content.ContentValues();
                    v.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, filename);
                    v.put(android.provider.MediaStore.Downloads.MIME_TYPE,
                            filename.endsWith(".enc") ? "application/octet-stream" : "application/json");
                    v.put(android.provider.MediaStore.Downloads.RELATIVE_PATH, android.os.Environment.DIRECTORY_DOWNLOADS);
                    android.net.Uri uri = getContentResolver().insert(
                            android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    if (uri == null) throw new IllegalStateException("no uri");
                    java.io.OutputStream out = getContentResolver().openOutputStream(uri);
                    out.write(bytes);
                    out.close();
                } else {
                    File dir = android.os.Environment.getExternalStoragePublicDirectory(
                            android.os.Environment.DIRECTORY_DOWNLOADS);
                    dir.mkdirs();
                    File f = new File(dir, filename);
                    FileOutputStream out = new FileOutputStream(f);
                    out.write(bytes);
                    out.close();
                }
                toast("اتحفظت النسخة في مجلد Downloads ✓");
            } catch (Exception e) {
                toast("حصلت مشكلة في الحفظ");
            }
        }

        @JavascriptInterface
        public void saveWidget(final String startTs, final String accent) {
            try {
                android.content.SharedPreferences p = getSharedPreferences(WidgetCounterProvider.PREFS, MODE_PRIVATE);
                p.edit().putLong("startTs", Long.parseLong(startTs)).putString("accent", accent).apply();
                android.appwidget.AppWidgetManager mgr = android.appwidget.AppWidgetManager.getInstance(MainActivity.this);
                int[] ids = mgr.getAppWidgetIds(new android.content.ComponentName(MainActivity.this, WidgetCounterProvider.class));
                for (int id : ids) WidgetCounterProvider.update(MainActivity.this, mgr, id);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void saveOccasions(final String json) {
            try {
                android.content.SharedPreferences p = getSharedPreferences(WidgetCounterProvider.PREFS, MODE_PRIVATE);
                p.edit().putString("occasionsJson", json).apply();
                android.appwidget.AppWidgetManager mgr = android.appwidget.AppWidgetManager.getInstance(MainActivity.this);
                int[] ids = mgr.getAppWidgetIds(new android.content.ComponentName(MainActivity.this, WidgetOccasionProvider.class));
                for (int id : ids) WidgetOccasionProvider.update(MainActivity.this, mgr, id);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public boolean hasBiometric() {
            if (Build.VERSION.SDK_INT < 28) return false;
            try {
                if (Build.VERSION.SDK_INT >= 29) {
                    android.hardware.biometrics.BiometricManager bm = getSystemService(android.hardware.biometrics.BiometricManager.class);
                    return bm != null && bm.canAuthenticate() == android.hardware.biometrics.BiometricManager.BIOMETRIC_SUCCESS;
                }
                android.hardware.fingerprint.FingerprintManager fm = getSystemService(android.hardware.fingerprint.FingerprintManager.class);
                return fm != null && fm.isHardwareDetected() && fm.hasEnrolledFingerprints();
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void promptBiometric() {
            if (Build.VERSION.SDK_INT < 28) { jsCallback("window.__bioResult && __bioResult(false)"); return; }
            ui.post(() -> {
                try {
                    BiometricPrompt bp = new BiometricPrompt.Builder(MainActivity.this)
                            .setTitle("انتكاسة")
                            .setSubtitle("افتح ببصمتك")
                            .setNegativeButton("استخدم الأرقام", getMainExecutor(), (d, w) ->
                                    jsCallback("window.__bioCancel && __bioCancel()"))
                            .build();
                    bp.authenticate(new CancellationSignal(), getMainExecutor(),
                            new BiometricPrompt.AuthenticationCallback() {
                                @Override
                                public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult r) {
                                    jsCallback("window.__bioResult && __bioResult(true)");
                                }
                                @Override
                                public void onAuthenticationError(int code, CharSequence err) {
                                    jsCallback("window.__bioResult && __bioResult(false)");
                                }
                            });
                } catch (Exception e) {
                    jsCallback("window.__bioResult && __bioResult(false)");
                }
            });
        }

        @JavascriptInterface
        public void openUrl(final String url) {
            try {
                startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url)));
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void setIcon(final String mode) {
            try {
                PackageManager pm = getPackageManager();
                ComponentName main = new ComponentName(MainActivity.this, MainActivity.class);
                ComponentName cap = new ComponentName(MainActivity.this, "com.roza.intikasa.CapAlias");
                ComponentName stick = new ComponentName(MainActivity.this, "com.roza.intikasa.StickAlias");
                ComponentName logo1 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo1Alias");
                ComponentName logo2 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo2Alias");
                ComponentName logo3 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo3Alias");
                ComponentName logo4 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo4Alias");
                ComponentName logo5 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo5Alias");
                ComponentName logo6 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo6Alias");
                ComponentName logo7 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo7Alias");
                ComponentName logo8 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo8Alias");
                ComponentName logo9 = new ComponentName(MainActivity.this, "com.roza.intikasa.Logo9Alias");
                ComponentName active = "cap".equals(mode) ? cap : ("stick".equals(mode) ? stick
                        : ("logo1".equals(mode) ? logo1 : ("logo2".equals(mode) ? logo2
                        : ("logo3".equals(mode) ? logo3 : ("logo4".equals(mode) ? logo4
                        : ("logo5".equals(mode) ? logo5 : ("logo6".equals(mode) ? logo6
                        : ("logo7".equals(mode) ? logo7 : ("logo8".equals(mode) ? logo8
                        : ("logo9".equals(mode) ? logo9 : main))))))))));
                ComponentName[] all = { main, cap, stick, logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9 };
                for (ComponentName c : all) {
                    pm.setComponentEnabledSetting(c,
                            c.equals(active) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                                    : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                            PackageManager.DONT_KILL_APP);
                }
            } catch (Exception e) {
                toast("تغيير الأيقونة مش متاح على الجهاز ده");
            }
        }

        @JavascriptInterface
        public void shareImage(final String base64Png) {
            new Thread(() -> {
                try {
                    byte[] bytes = Base64.decode(base64Png, Base64.DEFAULT);
                    Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
                    if (bmp == null) throw new Exception("decode failed");
                    if (Build.VERSION.SDK_INT < 29 &&
                            checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                                    != PackageManager.PERMISSION_GRANTED) {
                        ui.post(() -> requestPermissions(
                                new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 9003));
                        toast("اسمح بالتخزين وحاول تاني");
                        return;
                    }
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.Images.Media.DISPLAY_NAME, "intikasa-" + System.currentTimeMillis() + ".png");
                    cv.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                    Uri collection;
                    if (Build.VERSION.SDK_INT >= 29) {
                        cv.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Intikasa");
                        cv.put(MediaStore.Images.Media.IS_PENDING, 1);
                        collection = MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                    } else {
                        collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                    }
                    Uri uri = getContentResolver().insert(collection, cv);
                    if (uri == null) throw new Exception("insert failed");
                    OutputStream os = getContentResolver().openOutputStream(uri);
                    bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                    if (os != null) os.close();
                    if (Build.VERSION.SDK_INT >= 29) {
                        cv.clear();
                        cv.put(MediaStore.Images.Media.IS_PENDING, 0);
                        getContentResolver().update(uri, cv, null, null);
                    }
                    final Uri shareUri = uri;
                    ui.post(() -> {
                        Intent send = new Intent(Intent.ACTION_SEND);
                        send.setType("image/png");
                        send.putExtra(Intent.EXTRA_STREAM, shareUri);
                        send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(send, "شارك إنجازك 🏆"));
                    });
                } catch (Exception e) {
                    toast("حصلت مشكلة في تجهيز الصورة");
                }
            }).start();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // لو القفل متفعل، نطلبه تاني عند الرجوع للتطبيق (الـJS بيقرر حسب مدة الغياب)
        if (web != null) web.evaluateJavascript("window.__intikasaResume && __intikasaResume()", null);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
