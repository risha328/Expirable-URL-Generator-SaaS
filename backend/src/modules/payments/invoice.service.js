import PDFDocument from "pdfkit";

/**
 * Build a simple GST-ready invoice PDF buffer.
 */
export function buildInvoicePdf({
  invoiceNumber,
  paidAt,
  customerName,
  customerEmail,
  businessName,
  gstin,
  billingAddress,
  plan,
  billingCycle,
  amountPaise,
  currency = "INR",
  paymentId,
  promoCode,
  discountPaise = 0,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const amount = ((amountPaise || 0) / 100).toFixed(2);
    const discount = ((discountPaise || 0) / 100).toFixed(2);
    const taxable = Number(amount);
    const gstRate = 0.18;
    const taxableBase = +(taxable / (1 + gstRate)).toFixed(2);
    const gstAmount = +(taxable - taxableBase).toFixed(2);

    doc.fontSize(22).text("Expireo", { continued: false });
    doc.fontSize(10).fillColor("#555").text("Expirable URL Generator SaaS");
    doc.moveDown();
    doc.fillColor("#000").fontSize(16).text("TAX INVOICE");
    doc.moveDown(0.5);

    doc.fontSize(10);
    doc.text(`Invoice No: ${invoiceNumber || "—"}`);
    doc.text(`Date: ${paidAt ? new Date(paidAt).toLocaleString("en-IN") : new Date().toLocaleString("en-IN")}`);
    doc.text(`Payment ID: ${paymentId || "—"}`);
    doc.moveDown();

    doc.fontSize(12).text("Bill To");
    doc.fontSize(10);
    doc.text(businessName || customerName || "Customer");
    doc.text(customerEmail || "");
    if (gstin) doc.text(`GSTIN: ${gstin}`);
    if (billingAddress) doc.text(billingAddress);
    doc.moveDown();

    doc.fontSize(12).text("Particulars");
    doc.moveDown(0.3);
    doc.fontSize(10);
    doc.text(`Subscription: ${plan} (${billingCycle})`);
    if (promoCode) doc.text(`Promo: ${promoCode} (−₹${discount})`);
    doc.moveDown();

    doc.text(`Taxable value: ₹${taxableBase.toFixed(2)}`);
    doc.text(`GST (18% incl.): ₹${gstAmount.toFixed(2)}`);
    doc.fontSize(12).text(`Total (${currency}): ₹${amount}`, { underline: true });
    doc.moveDown(2);

    doc.fontSize(9).fillColor("#666").text(
      "This is a computer-generated invoice. Amount is inclusive of applicable GST where relevant."
    );

    doc.end();
  });
}

export function nextInvoiceNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `EXP-${y}${m}-${rand}`;
}
