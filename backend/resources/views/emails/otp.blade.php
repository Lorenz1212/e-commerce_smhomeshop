<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f2f3f5;font-family:sans-serif;">
    <div style="background-color:#f2f3f5;padding:20px">
        <div style="max-width:600px;margin:0 auto">
        <div style="background:#fff;font:14px sans-serif;color:#444;border-top:4px solid #36ae6a;margin-bottom:20px;border-radius:6px;overflow:hidden">
            <div style="padding:25px 30px">

            <!-- Greeting -->
            <p style="margin:0;font-size:16px;color:#000;">Hi {{ ucfirst($fname) }},</p>
            <p>&nbsp;</p>

            <!-- Message -->
            <p style="margin:0;color:#555;line-height:1.6;">
                You requested to reset your password. Please use the One-Time Password (OTP) below to complete the process.
            </p>
            <p>&nbsp;</p>

            <!-- OTP Code -->
            <h2 style="text-align:center;letter-spacing:6px;margin:15px 0;color:#36ae6a;font-size:28px;">
                {{ $otp }}
            </h2>
            <p style="margin:0;color:#888;font-size:13px;text-align:center;">
                This code will expire in 5 minutes. Do not share it with anyone.
            </p>
            <p>&nbsp;</p>

            <!-- Security Notice -->
            <p style="margin:0;color:#555;line-height:1.6;">
                If you did not request this password reset, you can safely ignore this email.
            </p>
            <p>&nbsp;</p>


            </div>
        </div>
        </div>
    </div>
    </body>
</html>