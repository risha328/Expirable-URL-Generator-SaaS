import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

/**
 * Send payment/subscription receipt email. No-ops (logs) if SMTP not configured.
 */
export async function sendPaymentReceipt({ to, userName, plan, amountPaise, currency, invoiceNumber, paymentId }) {
  const amountInr = ((amountPaise || 0) / 100).toFixed(2);
  const subject = `Expireo receipt — ${plan} plan`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>Payment received</h2>
      <p>Hi ${userName || "there"},</p>
      <p>Thank you for subscribing to <strong>Expireo ${plan}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;border-bottom:1px solid #eee">Amount</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${currency || "INR"} ${amountInr}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee">Invoice</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${invoiceNumber || "—"}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee">Payment ID</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${paymentId || "—"}</td></tr>
      </table>
      <p style="color:#666;font-size:13px">You can download invoices anytime from Billing in your dashboard.</p>
    </div>
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[email] SMTP not configured — receipt for ${to}: ${subject} (${currency} ${amountInr})`);
    return { sent: false, reason: "smtp_not_configured" };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  return { sent: true };
}

export async function sendPaymentFailedNotice({ to, userName, plan, reason }) {
  const subject = `Expireo payment failed — ${plan}`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>Payment failed</h2>
      <p>Hi ${userName || "there"},</p>
      <p>We could not process your payment for <strong>${plan}</strong>.</p>
      <p>Reason: ${reason || "Unknown"}</p>
      <p><a href="${process.env.APP_URL || "http://localhost:5173"}/billing">Retry payment</a></p>
    </div>
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[email] SMTP not configured — failure notice for ${to}: ${reason}`);
    return { sent: false };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
  return { sent: true };
}
