function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
    <p style="color: #555; font-size: 15px; text-align: center;">
      Use the OTP below to complete your verification. This code is valid for <b>3 minutes</b>.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background: #f0f4ff; padding: 12px 24px; border-radius: 6px;">
        ${otp}
      </span>
    </div>
    <p style="color: #888; font-size: 13px; text-align: center;">
      If you didn't request this code, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="color: #aaa; font-size: 12px; text-align: center;">
      This is an automated message, please do not reply.
    </p>
  </div>
  `;
}

export { getOtpHtml, generateOtp}
