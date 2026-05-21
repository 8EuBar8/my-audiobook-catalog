import android.os.Bundle;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView myWebView = new WebView(this);

        setContentView(myWebView);

        myWebView.getSettings().setJavaScriptEnabled(true);

        myWebView.loadUrl("file:///android_asset/index.html");
    }
}