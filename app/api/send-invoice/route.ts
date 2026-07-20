import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, subject, message, formData } = body

    if (!to || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const taxRate = formData.taxRate ?? 0
    const subtotal = (formData.items ?? []).reduce(
      (s: number, it: any) => s + it.quantity * it.unitPrice, 0
    )
    const tax = subtotal * (taxRate / 100)
    const grandTotal = subtotal + tax

    const fmt = (n: number) =>
      `PKR ${Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

    const itemsHtml = (formData.items ?? [])
      .filter((it: any) => it.name)
      .map(
        (it: any, i: number) => `
        <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};">
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">${i + 1}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">
            <strong>${it.name}</strong>
            ${it.description ? `<br/><span style="color:#6b7280;font-size:11px;">${it.description}</span>` : ""}
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;">${fmt(it.unitPrice)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${fmt(it.quantity * it.unitPrice)}</td>
        </tr>`
      )
      .join("")

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:30px 0;">
<tr><td align="center">
<table width="660" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:660px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:2px;">GENCORE</div>
            <div style="font-size:11px;color:#f97316;margin-top:2px;">The Core of Digital Transformation.</div>
          </td>
          <td align="right" style="color:#93c5fd;font-size:11px;line-height:1.7;">
            4th Floor, Saeed Alam Tower, Liberty Market, Lahore<br/>
            +92 332 0000911<br/>
            nauman@gencoreit.com<br/>
            www.gencoreit.com
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Title bar -->
  <tr>
    <td style="background:#f97316;padding:10px 32px;">
      <div style="font-size:15px;font-weight:700;color:#ffffff;text-align:center;letter-spacing:3px;text-transform:uppercase;">Invoice</div>
    </td>
  </tr>

  <!-- Body -->
  <tr><td style="padding:28px 32px;">

    <!-- Business description -->
    <div style="border-left:3px solid #1e40af;padding:8px 12px;background:#f8fafc;border-radius:0 4px 4px 0;font-size:11px;color:#4b5563;font-style:italic;margin-bottom:24px;line-height:1.6;">
      Gencore delivers end-to-end enterprise technology solutions, including IT infrastructure, networking, cybersecurity, cloud computing, AI-powered surveillance, software development, system integration, managed IT services, and the supply, deployment, and support of enterprise IT hardware and software.
    </div>

    ${message ? `
    <!-- Custom message -->
    <div style="background:#eff6ff;border-left:4px solid #1e40af;border-radius:4px;padding:14px 16px;margin-bottom:24px;font-size:13px;color:#1e40af;line-height:1.6;">
      ${message.replace(/\n/g, "<br/>")}
    </div>` : ""}

    <!-- Invoice Details + Client -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="48%" style="vertical-align:top;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;">
          <div style="font-size:10px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Invoice Details</div>
          <table cellpadding="0" cellspacing="0" style="font-size:12px;width:100%;">
            ${formData.invoiceNumber ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;white-space:nowrap;">Invoice No:</td><td style="font-weight:600;">${formData.invoiceNumber}</td></tr>` : ""}
            ${formData.date ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Date:</td><td>${formData.date}</td></tr>` : ""}
            ${formData.dueDate ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Due Date:</td><td>${formData.dueDate}</td></tr>` : ""}
            <tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Tax Rate:</td><td>${taxRate}%</td></tr>
          </table>
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align:top;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;">
          <div style="font-size:10px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Bill To</div>
          <table cellpadding="0" cellspacing="0" style="font-size:12px;width:100%;">
            ${formData.client?.name ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Name:</td><td style="font-weight:600;">${formData.client.name}</td></tr>` : ""}
            ${formData.client?.company ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Company:</td><td>${formData.client.company}</td></tr>` : ""}
            ${formData.client?.address ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Address:</td><td>${formData.client.address}</td></tr>` : ""}
            ${formData.client?.phone ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Phone:</td><td>${formData.client.phone}</td></tr>` : ""}
            ${formData.client?.email ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Email:</td><td>${formData.client.email}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:8px;">Items</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#1e40af;color:#ffffff;">
            <th style="padding:8px 10px;text-align:left;">#</th>
            <th style="padding:8px 10px;text-align:left;">Description</th>
            <th style="padding:8px 10px;text-align:center;">Qty</th>
            <th style="padding:8px 10px;text-align:right;">Unit Price</th>
            <th style="padding:8px 10px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="padding:8px 10px;text-align:right;color:#6b7280;">Subtotal</td>
            <td style="padding:8px 10px;text-align:right;">${fmt(subtotal)}</td>
          </tr>
          <tr>
            <td colspan="4" style="padding:8px 10px;text-align:right;color:#6b7280;">Tax (${taxRate}%)</td>
            <td style="padding:8px 10px;text-align:right;">${fmt(tax)}</td>
          </tr>
          <tr style="background:#fff7ed;">
            <td colspan="4" style="padding:10px;text-align:right;font-weight:700;color:#f97316;font-size:13px;">Grand Total</td>
            <td style="padding:10px;text-align:right;font-weight:700;color:#f97316;font-size:13px;">${fmt(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    ${formData.bankDetails?.bankName ? `
    <!-- Bank Details -->
    <div style="margin-bottom:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Payment / Bank Details</h3>
      <table cellpadding="0" cellspacing="0" style="font-size:12px;">
        <tr><td style="color:#6b7280;padding:2px 0;padding-right:16px;">Bank:</td><td>${formData.bankDetails.bankName}</td></tr>
        ${formData.bankDetails.accountTitle ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:16px;">Account Title:</td><td>${formData.bankDetails.accountTitle}</td></tr>` : ""}
        ${formData.bankDetails.accountNumber ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:16px;">Account No:</td><td>${formData.bankDetails.accountNumber}</td></tr>` : ""}
        ${formData.bankDetails.iban ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:16px;">IBAN:</td><td>${formData.bankDetails.iban}</td></tr>` : ""}
      </table>
    </div>` : ""}

    <!-- Contact note -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#15803d;line-height:1.7;">
        For any queries regarding this invoice, please feel free to reach us:<br/>
        📧 <a href="mailto:info@gencoreit.com" style="color:#1e40af;font-weight:600;">info@gencoreit.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        📞 <a href="tel:03320000911" style="color:#1e40af;font-weight:600;">0332 0000911</a>
      </p>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr>
    <td style="background:#1e3a8a;padding:18px 32px;text-align:center;">
      <div style="font-size:12px;font-weight:600;color:#ffffff;">The Core of Digital Transformation.</div>
      <div style="font-size:11px;color:#93c5fd;margin-top:4px;">+92 332 0000911 &nbsp;|&nbsp; nauman@gencoreit.com &nbsp;|&nbsp; www.gencoreit.com</div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`

    const { data, error } = await resend.emails.send({
      from: "GENCORE <noreply@gencoreit.com>",
      to: [to],
      subject: subject || `Invoice${formData.invoiceNumber ? ` ${formData.invoiceNumber}` : ""} from GENCORE`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: any) {
    console.error("Send invoice error:", err)
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 })
  }
}
