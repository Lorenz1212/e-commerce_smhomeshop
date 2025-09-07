<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Account Verification</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#fffaf5; color:#5a4634; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
    .card { background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); max-width:420px; text-align:center; }
    .title { font-size:20px; margin-bottom:8px; font-weight:600; }
    .msg { margin:12px 0 18px; color:#6b4f3a; }
    .success { color: #2d7a32; }
    .error { color: #c62828; }
    .btn { display:inline-block; padding:10px 16px; border-radius:8px; background:#d4a373; color:white; text-decoration:none; font-weight:600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">
      @if($status === 'success') ✅ Account Verified
      @elseif($status === 'info') ℹ️ Already Verified
      @else ❌ Verification Failed
      @endif
    </div>

    <div class="msg {{ $status === 'success' ? 'success' : ($status === 'info' ? 'info' : 'error') }}">
      {{ $message }}
    </div>

  </div>
</body>
</html>
