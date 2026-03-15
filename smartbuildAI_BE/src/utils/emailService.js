// ===== NEW FILE CREATED FOR OTP AUTH FEATURE =====
const nodemailer = require('nodemailer');

// ===== MODIFIED START (OTP AUTH FEATURE) =====
// Tạo transporter chuẩn cho Gmail / SMTP, kiểm tra cấu hình ENV rõ ràng
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    '[emailService] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Gửi email sẽ bị lỗi.'
  );
}

// Ưu tiên dùng service (vd: gmail); nếu cần tùy biến có thể mở rộng host/port từ ENV
const transporter = nodemailer.createTransport(
  EMAIL_SERVICE
    ? {
        service: EMAIL_SERVICE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      }
    : {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      }
);

const FROM_ADDRESS = EMAIL_FROM || EMAIL_USER || 'noreply@smartbuild.vn';

/**
 * Send OTP verification email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP (plain, for email body only)
 * @returns {Promise<void>}
 */
async function sendOTPEmail(to, otp) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email service is not configured correctly (missing credentials)');
  }

  const subject = 'SmartBuild - Xác minh tài khoản';
  const body = `Xin chào,

Mã OTP xác minh tài khoản SmartBuild của bạn là:

${otp}

Mã có hiệu lực trong 5 phút.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

SmartBuild Team`;

  const mailOptions = {
    from: FROM_ADDRESS,
    to,
    subject,
    text: body
  };

  await transporter.sendMail(mailOptions);
}

// ===== MODIFIED START (FORGOT PASSWORD FEATURE) =====
/**
 * Send OTP email for password reset
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP (plain)
 * @returns {Promise<void>}
 */
async function sendResetPasswordOTPEmail(to, otp) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email service is not configured correctly (missing credentials)');
  }
  const subject = 'SmartBuild - Reset mật khẩu';
  const body = `Xin chào,

Mã OTP đặt lại mật khẩu của bạn là:

${otp}

Mã có hiệu lực trong 5 phút.

Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.

SmartBuild Team`;

  const mailOptions = {
    from: FROM_ADDRESS,
    to,
    subject,
    text: body
  };
  await transporter.sendMail(mailOptions);
}
// ===== MODIFIED END (FORGOT PASSWORD FEATURE) =====

module.exports = {
  sendOTPEmail,
  sendResetPasswordOTPEmail
};
// ===== MODIFIED END (OTP AUTH FEATURE) =====
