package com.example.notenest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.animation.ArgbEvaluator;
import android.animation.ObjectAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.biometrics.BiometricPrompt;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.material.snackbar.Snackbar;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends AppCompatActivity {

    private WebView webview;

    private ValueCallback<Uri[]> filePathCallback;
    private final static int FILECHOOSER_RESULTCODE = 1;
    private final static int EXPORT_REQUEST_CODE = 2;

    private static final int PERMISSION_REQUEST_CODE = 1;
    private static final int SAVE_DOCUMENT_REQUEST_CODE = 2;

    private String dataToSave;

    private boolean doubleBackToExitPressedOnce = false;

    @Override
    public void onBackPressed() {
        if (webview.canGoBack()) {
            webview.goBack();
        } else {
            if (doubleBackToExitPressedOnce) {
                super.onBackPressed();
                return;
            }

            this.doubleBackToExitPressedOnce = true;
            Toast.makeText(this, "Press again to exit", Toast.LENGTH_SHORT).show();

            new Handler().postDelayed(() -> doubleBackToExitPressedOnce = false, 2000);
        }
    }


    //    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        );


        setContentView(R.layout.activity_main);




        webview = findViewById(R.id.webView);

        WebSettings webSettings = webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setAllowContentAccess(true);
        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        webview.setVerticalScrollBarEnabled(false);
        webview.setHorizontalScrollBarEnabled(false);
        webview.setWebViewClient(new WebViewClientDemo());
        AndroidInterface androidInterface = new AndroidInterface(this);
        webview.addJavascriptInterface(androidInterface, "AndroidInterface");
        webview.setBackgroundColor(getResources().getColor(R.color.black));
        webview.addJavascriptInterface(new WebAppInterface(), "Android");
        webview.addJavascriptInterface(new ShowToastInterface(this), "ToastAndroidShow");



        webview.loadUrl("file:///android_asset/index.html");

        requestStoragePermission();



        webview.setWebChromeClient(new WebChromeClient() {


            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(view.getContext())
                        .setTitle("Backup error")
                        .setMessage(message)
                        .setPositiveButton("OK", (DialogInterface dialog, int which) -> result.confirm())
                        .setOnDismissListener((DialogInterface dialog) -> result.confirm())
                        .create()
                        .show();
                return true;
            }


            @Override
            public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(view.getContext())
                        .setTitle("Delete this login")
                        .setMessage(message)
                        .setPositiveButton("OK", (DialogInterface dialog, int which) -> result.confirm())
                        .setNegativeButton("Cancel", (DialogInterface dialog, int which) -> result.cancel())
                        .setOnDismissListener((DialogInterface dialog) -> result.cancel())
                        .create()
                        .show();
                return true;
            }

            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
                final EditText input = new EditText(view.getContext());
                input.setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
                input.setText(defaultValue);
                input.setPadding(20, 50, 20, 30);


                new AlertDialog.Builder(view.getContext())
                        .setTitle("Enter password")
//                        .setMessage(message)
                        .setView(input)
                        .setPositiveButton("OK", (DialogInterface dialog, int which) -> result.confirm(input.getText().toString()))
                        .setNegativeButton("Cancel", (DialogInterface dialog, int which) -> result.cancel())
                        .setOnDismissListener((DialogInterface dialog) -> result.cancel())
                        .create()
                        .show();
                return true;





            }



            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }

            // For Android < 5.0
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {
                openFileChooser(uploadMsg, "");
            }

            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
                openFileChooser(uploadMsg, acceptType, "");
            }

            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                startActivityForResult(Intent.createChooser(intent, "File Chooser"), FILECHOOSER_RESULTCODE);
            }
        });




    }






    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK) {
                    if (data != null) {
                        String dataString = data.getDataString();
                        if (dataString != null) {
                            results = new Uri[]{Uri.parse(dataString)};
                        }
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        } else if (requestCode == SAVE_DOCUMENT_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                if (data != null && data.getData() != null) {
                    Uri uri = data.getData();
                    saveToUri(uri);
                } else {
                    Toast.makeText(this, "Error exporting", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }





    private void requestStoragePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults); // Ensure superclass call

        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Storage permission granted.", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Storage permission denied.", Toast.LENGTH_SHORT).show();
            }
        }
    }


    public class WebAppInterface {
        @JavascriptInterface
        public void saveFile(String data) {
            dataToSave = data;
            openFilePickerExport();
        }
    }


    private void openFilePickerExport() {
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "NoteNestBackup.json");
        startActivityForResult(intent, SAVE_DOCUMENT_REQUEST_CODE);
    }



    private void saveToUri(Uri uri) {
        try {
            OutputStream outputStream = getContentResolver().openOutputStream(uri);
            if (outputStream != null) {
                outputStream.write(dataToSave.getBytes());
                outputStream.close();
                Toast.makeText(this, "Backup saved", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Error saving file", Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }
    }


    public class ShowToastInterface {
        private final Context mContext;

        public ShowToastInterface(Context context) {
            this.mContext = context;
        }

        @JavascriptInterface
        public void ShowToast(final String text, final String time) {
            int duration = Toast.LENGTH_SHORT;
            if (time.equals("long")) {
                duration = Toast.LENGTH_LONG;
            } else if(time.equals("short")){
                duration = Toast.LENGTH_SHORT;
            }
            Toast.makeText(mContext, text, duration).show();
        }
    }




    public class AndroidInterface {
        private MainActivity mActivity;

        AndroidInterface(MainActivity activity) {
            mActivity = activity;
        }

        @JavascriptInterface
        public void updateStatusBarColor(final String color) {
            mActivity.runOnUiThread(new Runnable() {
                @SuppressLint("ResourceType")
                @RequiresApi(api = Build.VERSION_CODES.O)
                @Override
                public void run() {
                    int statusBarColor;
                    int navigationBarColor;
                    int systemUiVisibilityFlags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;


                    if (color.equals("Activitybluedark")) {
                        statusBarColor = 0xFF121318;
                        navigationBarColor = 0xFF121318;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("Activitybluelight")) {
                        statusBarColor = 0xFFfaf8ff;
                        navigationBarColor = 0xFFfaf8ff;


                    } else if (color.equals("Activitypurplelight")) {
                        statusBarColor = 0xFFfff7fd;
                        navigationBarColor = 0xFFfff7fd;

                    } else if (color.equals("Activitypurpledark")) {
                        statusBarColor = 0xFF161217;
                        navigationBarColor = 0xFF161217;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("Activityyellowlight")) {
                        statusBarColor = 0xFFfdf9ec;
                        navigationBarColor = 0xFFfdf9ec;
                    } else if (color.equals("Activityyellowdark")) {
                        statusBarColor = 0xFF14140c;
                        navigationBarColor = 0xFF14140c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("Activitygreenlight")) {
                        statusBarColor = 0xFFf8fbf1;
                        navigationBarColor = 0xFFf8fbf1;

                    } else if (color.equals("Activitygreendark")) {
                        statusBarColor = 0xFF11140f;
                        navigationBarColor = 0xFF11140f;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("Activityredlight")) {
                        statusBarColor = 0xFFfff8f6;
                        navigationBarColor = 0xFFfff8f6;
                    } else if (color.equals("Activityreddark")) {
                        statusBarColor = 0xFF1a1110;
                        navigationBarColor = 0xFF1a1110;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("ActivityPinklight")) {
                        statusBarColor = 0xFFfff8f8;
                        navigationBarColor = 0xFFfff8f8;
                    } else if (color.equals("ActivityPinkdark")) {
                        statusBarColor = 0xFF181213;
                        navigationBarColor = 0xFF181213;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("ActivityCharcollight")) {
                        statusBarColor = 0xFFf9f9f9;
                        navigationBarColor = 0xFFf9f9f9;

                    } else if (color.equals("ActivityCharcoldark")) {
                        statusBarColor = 0xFF131313;
                        navigationBarColor = 0xFF131313;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("ActivityOrangelight")) {
                        statusBarColor = 0xFFfff8f4;
                        navigationBarColor = 0xFFfff8f4;

                    } else if (color.equals("ActivityOrangedark")) {
                        statusBarColor = 0xFF17130d;
                        navigationBarColor = 0xFF17130d;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("ActivityBlueBrightLight")) {
                        statusBarColor = 0xFFfaf8ff;
                        navigationBarColor = 0xFFfaf8ff;

                    } else if (color.equals("ActivityBlueBrightdark")) {
                        statusBarColor = 0xFF11131a;
                        navigationBarColor = 0xFF11131a;
                        systemUiVisibilityFlags = 0;


//                        Main-START
                    } else if (color.equals("blue-light")) {
                        statusBarColor = 0xFFfaf8ff;
                        navigationBarColor = 0xFFeeedf4;
                        setTheme(R.style.blue_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.blue_light));


                    } else if (color.equals("blue-dark")) {
                        statusBarColor = 0xFF121318;
                        navigationBarColor = 0xFF1e1f25;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.blue_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.blue_dark));


                    } else if (color.equals("purple-light")) {
                        statusBarColor = 0xFFfff7fd;
                        navigationBarColor = 0xFFf4ebf3;
                        setTheme(R.style.purple_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.purple_light));


                    } else if (color.equals("purple-dark")) {
                        statusBarColor = 0xFF161217;
                        navigationBarColor = 0xFF221e24;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.purple_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.purple_dark));


                    } else if (color.equals("yellow-light")) {
                        statusBarColor = 0xFFfdf9ec;
                        navigationBarColor = 0xFFf1eee0;
                        setTheme(R.style.yellow_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.yellow_light));


                    } else if (color.equals("yellow-dark")) {
                        statusBarColor = 0xFF14140c;
                        navigationBarColor = 0xFF202018;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.yellow_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.yellow_dark));


                    } else if (color.equals("green-light")) {
                        statusBarColor = 0xFFf8fbf1;
                        navigationBarColor = 0xFFecefe5;
                        setTheme(R.style.green_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.green_light));


                    } else if (color.equals("green-dark")) {
                        statusBarColor = 0xFF11140f;
                        navigationBarColor = 0xFF1d211b;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.green_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.green_dark));


                    } else if (color.equals("red-light")) {
                        statusBarColor = 0xFFfff8f6;
                        navigationBarColor = 0xFFfceae7;
                        setTheme(R.style.red_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.red_light));


                    } else if (color.equals("red-dark")) {
                        statusBarColor = 0xFF1a1110;
                        navigationBarColor = 0xFF271d1c;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.red_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.red_dark));


                    } else if (color.equals("pink-light")) {
                        statusBarColor = 0xFFfff8f8;
                        navigationBarColor = 0xFFf8ebec;
                        setTheme(R.style.pink_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.pink_light));


                    } else if (color.equals("pink-dark")) {
                        statusBarColor = 0xFF181213;
                        navigationBarColor = 0xFF241e1f;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.pink_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.pink_dark));


                    } else if (color.equals("charcol-light")) {
                        statusBarColor = 0xFFf9f9f9;
                        navigationBarColor = 0xFFeeeeee;
                        setTheme(R.style.charcol_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.charcoal_light));


                    } else if (color.equals("charcol-dark")) {
                        statusBarColor = 0xFF131313;
                        navigationBarColor = 0xFF1f1f1f;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.charcol_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.charcoal_dark));


                    } else if (color.equals("orange-light")) {
                        statusBarColor = 0xFFfff8f4;
                        navigationBarColor = 0xFFf8ece2;
                        setTheme(R.style.orange_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.orange_light));


                    } else if (color.equals("orange-dark")) {
                        statusBarColor = 0xFF17130d;
                        navigationBarColor = 0xFF241f19;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.orange_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.orange_dark));


                    } else if (color.equals("blue-bright-light")) {
                        statusBarColor = 0xFFfaf8ff;
                        navigationBarColor = 0xFFededf7;
                        setTheme(R.style.blue_bright_light_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.blue_bright_light));


                    } else if (color.equals("blue-bright-dark")) {
                        statusBarColor = 0xFF11131a;
                        navigationBarColor = 0xFF1d1f27;
                        systemUiVisibilityFlags = 0;
                        setTheme(R.style.blue_bright_dark_scheme);
                        webview.setBackgroundColor(getResources().getColor(R.color.blue_bright_dark));


//                        scroll colors main-window

                    } else if (color.equals("scroll-blue-dark")) {
                        statusBarColor = 0xFF1e1f25;
                        navigationBarColor = 0xFF1e1f25;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-blue-light")) {
                        statusBarColor = 0xFFeeedf4;
                        navigationBarColor = 0xFFeeedf4;

                    } else if (color.equals("scroll-purple-dark")) {
                        statusBarColor = 0xFF221e24;
                        navigationBarColor = 0xFF221e24;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-purple-light")) {
                        statusBarColor = 0xFFf4ebf3;
                        navigationBarColor = 0xFFf4ebf3;

                    } else if (color.equals("scroll-yellow-dark")) {
                        statusBarColor = 0xFF202018;
                        navigationBarColor = 0xFF202018;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-yellow-light")) {
                        statusBarColor = 0xFFf1eee0;
                        navigationBarColor = 0xFFf1eee0;

                    } else if (color.equals("scroll-green-dark")) {
                        statusBarColor = 0xFF1d211b;
                        navigationBarColor = 0xFF1d211b;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-green-light")) {
                        statusBarColor = 0xFFecefe5;
                        navigationBarColor = 0xFFecefe5;

                    } else if (color.equals("scroll-red-dark")) {
                        statusBarColor = 0xFF271d1c;
                        navigationBarColor = 0xFF271d1c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-red-light")) {
                        statusBarColor = 0xFFfceae7;
                        navigationBarColor = 0xFFfceae7;

                    } else if (color.equals("scroll-pink-dark")) {
                        statusBarColor = 0xFF261d20;
                        navigationBarColor = 0xFF261d20;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-pink-light")) {
                        statusBarColor = 0xFF261d20;
                        navigationBarColor = 0xFF261d20;

                    } else if (color.equals("scroll-charcol-dark")) {
                        statusBarColor = 0xFF1f1f1f;
                        navigationBarColor = 0xFF1f1f1f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-charcol-light")) {
                        statusBarColor = 0xFFeeeeee;
                        navigationBarColor = 0xFFeeeeee;

                    } else if (color.equals("scroll-orange-dark")) {
                        statusBarColor = 0xFF241f19;
                        navigationBarColor = 0xFF241f19;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("scroll-orange-light")) {
                        statusBarColor = 0xFFf8ece2;
                        navigationBarColor = 0xFFf8ece2;

                        //                        scroll colors search-window
                    } else if (color.equals("search-blue-dark")) {
                        statusBarColor = 0xFF1e1f25;
                        navigationBarColor = 0xFF121318;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-blue-light")) {
                        statusBarColor = 0xFFeeedf4;
                        navigationBarColor = 0xFFfaf8ff;

                    } else if (color.equals("search-purple-dark")) {
                        statusBarColor = 0xFF221e24;
                        navigationBarColor = 0xFF161217;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-purple-light")) {
                        statusBarColor = 0xFFf4ebf3;
                        navigationBarColor = 0xFFfff7fd;

                    } else if (color.equals("search-yellow-dark")) {
                        statusBarColor = 0xFF202018;
                        navigationBarColor = 0xFF14140c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-yellow-light")) {
                        statusBarColor = 0xFFf1eee0;
                        navigationBarColor = 0xFFfdf9ec;

                    } else if (color.equals("search-green-dark")) {
                        statusBarColor = 0xFF1d211b;
                        navigationBarColor = 0xFF11140f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-green-light")) {
                        statusBarColor = 0xFFecefe5;
                        navigationBarColor = 0xFFf8fbf1;

                    } else if (color.equals("search-red-dark")) {
                        statusBarColor = 0xFF271d1c;
                        navigationBarColor = 0xFF1a1110;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-red-light")) {
                        statusBarColor = 0xFFfceae7;
                        navigationBarColor = 0xFFfff8f6;

                    } else if (color.equals("search-pink-dark")) {
                        statusBarColor = 0xFF261d20;
                        navigationBarColor = 0xFF191113;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-pink-light")) {
                        statusBarColor = 0xFFfaeaed;
                        navigationBarColor = 0xFFfff8f8;

                    } else if (color.equals("search-charcol-dark")) {
                        statusBarColor = 0xFF1f1f1f;
                        navigationBarColor = 0xFF131313;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-charcol-light")) {
                        statusBarColor = 0xFFeeeeee;
                        navigationBarColor = 0xFFf9f9f9;

                    } else if (color.equals("search-orange-dark")) {
                        statusBarColor = 0xFF241f19;
                        navigationBarColor = 0xFF17130d;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-orange-light")) {
                        statusBarColor = 0xFFf8ece2;
                        navigationBarColor = 0xFFfff8f4;

                    } else if (color.equals("search-blueBright-dark")) {
                        statusBarColor = 0xFF1d1f27;
                        navigationBarColor = 0xFF11131a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("search-blueBright-light")) {
                        statusBarColor = 0xFFededf7;
                        navigationBarColor = 0xFFfaf8ff;

//                        other-fuctions-dialog

                    } else if (color.equals("dialog-blue-light")) {
                        statusBarColor = 0xFF646366;
                        navigationBarColor = 0xFF5f5f62;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-blue-dark")) {
                        statusBarColor = 0xFF07080a;
                        navigationBarColor = 0xFF0c0c0f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-purple-light")) {
                        statusBarColor = 0xFF666365;
                        navigationBarColor = 0xFF625e61;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-purple-dark")) {
                        statusBarColor = 0xFF090709;
                        navigationBarColor = 0xFF0e0c0e;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialog-yellow-light")) {
                        statusBarColor = 0xFF65645e;
                        navigationBarColor = 0xFF605f5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-yellow-dark")) {
                        statusBarColor = 0xFF080805;
                        navigationBarColor = 0xFF0d0d0a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-green-light")) {
                        statusBarColor = 0xFF636460;
                        navigationBarColor = 0xFF5e605c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-green-dark")) {
                        statusBarColor = 0xFF070806;
                        navigationBarColor = 0xFF0c0d0b;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialog-red-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF655e5c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-red-dark")) {
                        statusBarColor = 0xFF0a0706;
                        navigationBarColor = 0xFF100c0b;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-pink-light")) {
                        statusBarColor = 0xFF666363;
                        navigationBarColor = 0xFF645e5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-pink-dark")) {
                        statusBarColor = 0xFF0a0708;
                        navigationBarColor = 0xFF0f0c0d;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-charcoal-light")) {
                        statusBarColor = 0xFF646464;
                        navigationBarColor = 0xFF5f5f5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-charcoal-dark")) {
                        statusBarColor = 0xFF080808;
                        navigationBarColor = 0xFF0c0c0c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-orange-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF635e5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialog-orange-dark")) {
                        statusBarColor = 0xFF090805;
                        navigationBarColor = 0xFF0e0c0a;
                        systemUiVisibilityFlags = 0;


//                    inverted-dialog

                    } else if (color.equals("dialogInverted-blue-light")) {
                        navigationBarColor = 0xFF646366;
                        statusBarColor = 0xFF5f5f62;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-blue-dark")) {
                        navigationBarColor = 0xFF07080a;
                        statusBarColor = 0xFF0c0c0f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-purple-light")) {
                        navigationBarColor = 0xFF666365;
                        statusBarColor = 0xFF625e61;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-purple-dark")) {
                        navigationBarColor = 0xFF090709;
                        statusBarColor = 0xFF0e0c0e;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogInverted-yellow-light")) {
                        navigationBarColor = 0xFF65645e;
                        statusBarColor = 0xFF605f5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-yellow-dark")) {
                        navigationBarColor = 0xFF080805;
                        statusBarColor = 0xFF0d0d0a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-green-light")) {
                        navigationBarColor = 0xFF636460;
                        statusBarColor = 0xFF5e605c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-green-dark")) {
                        navigationBarColor = 0xFF070806;
                        statusBarColor = 0xFF0c0d0b;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogInverted-red-light")) {
                        navigationBarColor = 0xFF666362;
                        statusBarColor = 0xFF655e5c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-red-dark")) {
                        navigationBarColor = 0xFF0a0706;
                        statusBarColor = 0xFF100c0b;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-pink-light")) {
                        navigationBarColor = 0xFF666363;
                        statusBarColor = 0xFF645e5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-pink-dark")) {
                        navigationBarColor = 0xFF0a0708;
                        statusBarColor = 0xFF0f0c0d;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-charcoal-light")) {
                        navigationBarColor = 0xFF646464;
                        statusBarColor = 0xFF5f5f5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-charcoal-dark")) {
                        navigationBarColor = 0xFF080808;
                        statusBarColor = 0xFF0c0c0c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-orange-light")) {
                        navigationBarColor = 0xFF666362;
                        statusBarColor = 0xFF635e5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogInverted-orange-dark")) {
                        navigationBarColor = 0xFF090805;
                        statusBarColor = 0xFF0e0c0a;
                        systemUiVisibilityFlags = 0;


//                    dialog-color activity

                    } else if (color.equals("dialogActvity-blue-light")) {
                        statusBarColor = 0xFF646366;
                        navigationBarColor = 0xFF646366;
                        systemUiVisibilityFlags = 0;


                    } else if (color.equals("dialogActvity-blue-dark")) {
                        statusBarColor = 0xFF07080a;
                        navigationBarColor = 0xFF07080a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-purple-light")) {
                        statusBarColor = 0xFF666365;
                        navigationBarColor = 0xFF666365;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-purple-dark")) {
                        statusBarColor = 0xFF090709;
                        navigationBarColor = 0xFF090709;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogActvity-yellow-light")) {
                        statusBarColor = 0xFF65645e;
                        navigationBarColor = 0xFF65645e;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-yellow-dark")) {
                        statusBarColor = 0xFF080805;
                        navigationBarColor = 0xFF080805;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-green-light")) {
                        statusBarColor = 0xFF636460;
                        navigationBarColor = 0xFF636460;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-green-dark")) {
                        statusBarColor = 0xFF070806;
                        navigationBarColor = 0xFF070806;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogActvity-red-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF666362;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-red-dark")) {
                        statusBarColor = 0xFF0a0706;
                        navigationBarColor = 0xFF0a0706;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-pink-light")) {
                        statusBarColor = 0xFF666363;
                        navigationBarColor = 0xFF666363;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-pink-dark")) {
                        statusBarColor = 0xFF0a0708;
                        navigationBarColor = 0xFF0a0708;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-charcoal-light")) {
                        statusBarColor = 0xFF646464;
                        navigationBarColor = 0xFF646464;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-charcoal-dark")) {
                        statusBarColor = 0xFF080808;
                        navigationBarColor = 0xFF080808;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-orange-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF666362;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogActvity-orange-dark")) {
                        statusBarColor = 0xFF090805;
                        navigationBarColor = 0xFF090805;
                        systemUiVisibilityFlags = 0;


                        //                        sheet in activity

                    } else if (color.equals("sheetInverted-blue-light")) {
                        navigationBarColor = 0xFFf4f3fa;
                        statusBarColor = 0xFF5f5f62;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-blue-dark")) {
                        navigationBarColor = 0xFF1a1b20;
                        statusBarColor = 0xFF0c0c0f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-purple-light")) {
                        navigationBarColor = 0xFFfaf1f9;
                        statusBarColor = 0xFF625e61;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-purple-dark")) {
                        navigationBarColor = 0xFF1e1a20;
                        statusBarColor = 0xFF0e0c0e;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("sheetInverted-yellow-light")) {
                        navigationBarColor = 0xFFf7f4e6;
                        statusBarColor = 0xFF605f5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-yellow-dark")) {
                        navigationBarColor = 0xFF1c1c14;
                        statusBarColor = 0xFF0d0d0a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-green-light")) {
                        navigationBarColor = 0xFFf2f5eb;
                        statusBarColor = 0xFF5e605c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-green-dark")) {
                        navigationBarColor = 0xFF191d17;
                        statusBarColor = 0xFF0c0d0b;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("sheetInverted-red-light")) {
                        navigationBarColor = 0xFFfff0ee;
                        statusBarColor = 0xFF655e5c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-red-dark")) {
                        navigationBarColor = 0xFF231918;
                        statusBarColor = 0xFF100c0b;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-pink-light")) {
                        navigationBarColor = 0xFFfff0f2;
                        statusBarColor = 0xFF645e5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-pink-dark")) {
                        navigationBarColor = 0xFF22191c;
                        statusBarColor = 0xFF0f0c0d;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-charcoal-light")) {
                        navigationBarColor = 0xFFf3f3f3;
                        statusBarColor = 0xFF5f5f5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-charcoal-dark")) {
                        navigationBarColor = 0xFF1b1b1b;
                        statusBarColor = 0xFF0c0c0c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-orange-light")) {
                        navigationBarColor = 0xFFfef2e8;
                        statusBarColor = 0xFF635e5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("sheetInverted-orange-dark")) {
                        navigationBarColor = 0xFF201b15;
                        statusBarColor = 0xFF0e0c0a;
                        systemUiVisibilityFlags = 0;

//                        inverted dialog activity


                    } else if (color.equals("dialogflip-blue-light")) {
                        statusBarColor = 0xFF646366;
                        navigationBarColor = 0xFF5f5f62;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-blue-dark")) {
                        statusBarColor = 0xFF07080a;
                        navigationBarColor = 0xFF0c0c0f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-purple-light")) {
                        statusBarColor = 0xFF666365;
                        navigationBarColor = 0xFF625e61;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-purple-dark")) {
                        statusBarColor = 0xFF090709;
                        navigationBarColor = 0xFF0e0c0e;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogflip-yellow-light")) {
                        statusBarColor = 0xFF65645e;
                        navigationBarColor = 0xFF605f5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-yellow-dark")) {
                        statusBarColor = 0xFF080805;
                        navigationBarColor = 0xFF0d0d0a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-green-light")) {
                        statusBarColor = 0xFF636460;
                        navigationBarColor = 0xFF5e605c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-green-dark")) {
                        statusBarColor = 0xFF070806;
                        navigationBarColor = 0xFF0c0d0b;
                        systemUiVisibilityFlags = 0;
                    } else if (color.equals("dialogflip-red-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF655e5c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-red-dark")) {
                        statusBarColor = 0xFF0a0706;
                        navigationBarColor = 0xFF100c0b;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-pink-light")) {
                        statusBarColor = 0xFF666363;
                        navigationBarColor = 0xFF645e5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-pink-dark")) {
                        statusBarColor = 0xFF0a0708;
                        navigationBarColor = 0xFF0f0c0d;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-charcoal-light")) {
                        statusBarColor = 0xFF646464;
                        navigationBarColor = 0xFF5f5f5f;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-charcoal-dark")) {
                        statusBarColor = 0xFF080808;
                        navigationBarColor = 0xFF0c0c0c;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-orange-light")) {
                        statusBarColor = 0xFF666362;
                        navigationBarColor = 0xFF635e5a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("dialogflip-orange-dark")) {
                        statusBarColor = 0xFF090805;
                        navigationBarColor = 0xFF0e0c0a;
                        systemUiVisibilityFlags = 0;

                    } else if (color.equals("bluesetDef")) {

                        return;
                    } else if (color.equals("keepiton")) {
                        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                        return;
                    } else if (color.equals("keepitoff")) {
                        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                        return;
                    } else if (color.equals("itsOn")) {
                        Toast.makeText(mActivity, "Your device will stay awake", Toast.LENGTH_SHORT).show();
                        return;
                    } else if (color.equals("ItsOff")) {
                        Toast.makeText(mActivity, "Your device will go to sleep at the default time", Toast.LENGTH_SHORT).show();
                        return;
                    } else if (color.equals("clearClipboard")) {
                        clearClipboard();
                        return;
                    } else {
                        Toast.makeText(mActivity, "not found", Toast.LENGTH_SHORT).show();
                        return;
                    }


                    int currentStatusBarColor = mActivity.getWindow().getStatusBarColor();
                    int currentNavigationBarColor = mActivity.getWindow().getNavigationBarColor();

                    ObjectAnimator statusBarAnimator = ObjectAnimator.ofObject(
                            mActivity.getWindow(),
                            "statusBarColor",
                            new ArgbEvaluator(),
                            currentStatusBarColor,
                            statusBarColor
                    );

                    statusBarAnimator.setDuration(200);
                    statusBarAnimator.start();

                    ObjectAnimator navBarAnimator = ObjectAnimator.ofObject(
                            mActivity.getWindow(),
                            "navigationBarColor",
                            new ArgbEvaluator(),
                            currentNavigationBarColor,
                            navigationBarColor
                    );

                    navBarAnimator.setDuration(200);
                    navBarAnimator.start();

                    mActivity.getWindow().setNavigationBarColor(navigationBarColor);

                    View decorView = mActivity.getWindow().getDecorView();
                    decorView.setSystemUiVisibility(systemUiVisibilityFlags);


                }
            });



        }

        private void clearClipboard() {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null) {
                clipboard.setPrimaryClip(ClipData.newPlainText("", ""));
            }
        }

    }




    private static class WebViewClientDemo extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (shouldOpenInBrowser(url)) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                view.getContext().startActivity(intent);
                return true;
            } else {
                view.loadUrl(url);
                return true;
            }
        }



        private boolean shouldOpenInBrowser(String url) {
            // Return false for the URLs that should open in the WebView
            if (url.startsWith("file:///android_asset/index.html"))

            {
                return false;
            }
            // Return true for all other URLs to open in the browser
            return true;
        }
    }
}

