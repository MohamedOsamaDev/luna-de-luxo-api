export const forgetPasswordLayout = ({ OTP }) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #e9ecef;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
      }
      .container {
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        padding: 36px;
        text-align: center;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        margin: 0;
        font-size: 36px;
        font-weight: 700;
        line-height: 48px;
        color: #333333;
      }
      p {
        margin: 0 0 16px;
        font-size: 18px;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Reset Your Password</h1>
      <p>To reset your password, use the OTP below:</p>
      <p style="font-size: 24px; font-weight: 700;">${OTP}</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Cheers,<br> Alpha Company</p>
    </div>
  </body>
  </html>`;
};
