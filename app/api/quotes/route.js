import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, country, items, pricing } = body;

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Please provide customer name, email, and at least one product." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsRows = items
      .map((item) => {
        const qty = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const lineTotal = (qty * unitPrice).toFixed(2);
        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.productName || "Product"}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${qty}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">$${unitPrice.toFixed(2)}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">$${lineTotal}</td>
          </tr>
        `;
      })
      .join("");

    const subtotal = Number(pricing?.productsSubtotal || 0).toFixed(2);
    const shipping = Number(pricing?.shippingCharge || 0).toFixed(2);
    const taxPercent = Number(pricing?.taxPercent || 0);
    const taxAmount = Number(pricing?.taxAmount || 0).toFixed(2);
    const totalPrice = Number(pricing?.totalPrice || 0).toFixed(2);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <h2 style="color: #78350f;">Quotation Request Confirmation</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Thank you for your quotation request. Here are your estimated quotation details for <strong>${country}</strong>:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <thead>
            <tr style="background-color: #fef3c7;">
              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Product</th>
              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">Unit Price</th>
              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <p style="margin: 4px 0;"><strong>Products Subtotal:</strong> $${subtotal}</p>
        <p style="margin: 4px 0;"><strong>Shipping (${country}):</strong> $${shipping}</p>
        <p style="margin: 4px 0;"><strong>Tax (${taxPercent}%):</strong> $${taxAmount}</p>
        <h3 style="margin-top: 12px; color: #111827;">Estimated Total: $${totalPrice}</h3>

        <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">
          If you have any questions, simply reply to this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Instant Quotation" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Your Instant Quotation Summary (${country})`,
      html: htmlBody,
    });

    return NextResponse.json(
      { message: "Quotation submitted and confirmation email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending quotation email:", error);
    return NextResponse.json(
      { message: "Failed to send quotation email. Check email configuration." },
      { status: 500 }
    );
  }
}