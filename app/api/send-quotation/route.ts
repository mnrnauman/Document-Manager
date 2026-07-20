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

    const cur = formData.currency ?? "PKR"

    const fmt = (n: number) =>
      `${cur} ${Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

    const itemBase = (it: any) => {
      const gross = it.quantity * it.unitPrice
      const disc = gross * (it.discount / 100)
      return (gross - disc) * (1 + it.taxRate / 100)
    }

    const subtotal = (formData.items ?? []).reduce((s: number, it: any) => s + itemBase(it), 0)
    const totalTax = (formData.items ?? []).reduce(
      (s: number, it: any) => s + (it.quantity * it.unitPrice * (1 - it.discount / 100)) * (it.taxRate / 100),
      0
    )
    const grandTotal = subtotal + totalTax

    const itemsHtml = (formData.items ?? [])
      .filter((it: any) => it.name)
      .map(
        (it: any, i: number) => `
        <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"}">
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">${i + 1}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">
            <strong>${it.name}</strong>
            ${it.description ? `<br/><span style="color:#6b7280;font-size:11px;">${it.description}</span>` : ""}
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">${it.unit}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">${fmt(it.unitPrice)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.discount > 0 ? it.discount + "%" : "—"}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.taxRate > 0 ? it.taxRate + "%" : "—"}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${fmt(itemBase(it))}</td>
        </tr>`
      )
      .join("")

    const paymentHtml = (formData.paymentTerms ?? [])
      .map(
        (pt: any) => `
        <td style="width:33%;padding:12px;text-align:center;border:1px solid #e2e8f0;border-radius:6px;">
          <div style="font-size:22px;font-weight:700;color:#1e40af;">${pt.percentage}%</div>
          <div style="font-size:11px;color:#4b5563;margin-top:2px;">${pt.description}</div>
        </td>`
      )
      .join("")

    const scopeHtml =
      (formData.scopeItems ?? []).length > 0
        ? `<div style="margin-bottom:20px;">
            <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:8px;">Scope of Work</h3>
            <ol style="margin:0;padding-left:18px;color:#374151;font-size:12px;line-height:1.7;">
              ${(formData.scopeItems ?? []).map((s: any) => `<li>${s.title}${s.description ? `<br/><span style="color:#6b7280;font-size:11px;">${s.description}</span>` : ""}</li>`).join("")}
            </ol>
          </div>`
        : ""

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:30px 0;">
<tr><td align="center">
<table width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:680px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:2px;">GENCORE</div>
            <div style="font-size:11px;color:#f97316;margin-top:2px;">The Core of Digital Transformation.</div>
          </td>
          <td align="right" style="color:#93c5fd;font-size:11px;line-height:1.6;">
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
      <div style="font-size:15px;font-weight:700;color:#ffffff;text-align:center;letter-spacing:3px;text-transform:uppercase;">Quotation</div>
    </td>
  </tr>

  <!-- Body -->
  <tr><td style="padding:28px 32px;">

    ${message ? `
    <!-- Custom message -->
    <div style="background:#eff6ff;border-left:4px solid #1e40af;border-radius:4px;padding:14px 16px;margin-bottom:24px;font-size:13px;color:#1e40af;line-height:1.6;">
      ${message.replace(/\n/g, "<br/>")}
    </div>` : ""}

    <!-- Quotation Details + Customer Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="48%" style="vertical-align:top;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;">
          <div style="font-size:10px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Quotation Details</div>
          <table cellpadding="0" cellspacing="0" style="font-size:12px;width:100%;">
            ${formData.quotationNumber ? `<tr><td style="color:#6b7280;padding:2px 0;white-space:nowrap;padding-right:8px;">Quotation No:</td><td style="font-weight:600;">${formData.quotationNumber}</td></tr>` : ""}
            ${formData.revisionNumber ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Revision:</td><td>Rev ${formData.revisionNumber}</td></tr>` : ""}
            ${formData.date ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Issue Date:</td><td>${formData.date}</td></tr>` : ""}
            ${formData.validUntil ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Expiry Date:</td><td>${formData.validUntil}</td></tr>` : ""}
            <tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Currency:</td><td>${cur}</td></tr>
            <tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Tax Status:</td><td>${formData.taxStatus}</td></tr>
          </table>
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align:top;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;">
          <div style="font-size:10px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Customer Information</div>
          <table cellpadding="0" cellspacing="0" style="font-size:12px;width:100%;">
            ${formData.client?.company ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Company:</td><td style="font-weight:600;">${formData.client.company}</td></tr>` : ""}
            ${formData.client?.name ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Client:</td><td>${formData.client.name}</td></tr>` : ""}
            ${formData.client?.contactPerson ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Contact:</td><td>${formData.client.contactPerson}</td></tr>` : ""}
            ${formData.client?.department ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Dept:</td><td>${formData.client.department}</td></tr>` : ""}
            ${formData.client?.projectName ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Project:</td><td>${formData.client.projectName}</td></tr>` : ""}
            ${formData.client?.email ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Email:</td><td>${formData.client.email}</td></tr>` : ""}
            ${formData.client?.phone ? `<tr><td style="color:#6b7280;padding:2px 0;padding-right:8px;">Phone:</td><td>${formData.client.phone}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    ${formData.executiveSummary ? `
    <!-- Executive Summary -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:8px;">Executive Summary</h3>
      <p style="font-size:12px;color:#374151;line-height:1.7;margin:0;">${formData.executiveSummary}</p>
    </div>` : ""}

    ${scopeHtml}

    <!-- Pricing Table -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:8px;">Pricing</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#1e40af;color:#ffffff;">
            <th style="padding:8px 10px;text-align:left;">#</th>
            <th style="padding:8px 10px;text-align:left;">Item</th>
            <th style="padding:8px 10px;text-align:center;">Qty</th>
            <th style="padding:8px 10px;text-align:left;">Unit</th>
            <th style="padding:8px 10px;text-align:left;">Unit Price</th>
            <th style="padding:8px 10px;text-align:center;">Disc %</th>
            <th style="padding:8px 10px;text-align:center;">Tax %</th>
            <th style="padding:8px 10px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="7" style="padding:8px 10px;text-align:right;color:#6b7280;">Subtotal</td>
            <td style="padding:8px 10px;text-align:right;">${fmt(subtotal - totalTax)}</td>
          </tr>
          <tr>
            <td colspan="7" style="padding:8px 10px;text-align:right;color:#6b7280;">Tax</td>
            <td style="padding:8px 10px;text-align:right;">${fmt(totalTax)}</td>
          </tr>
          <tr style="background:#fff7ed;">
            <td colspan="7" style="padding:10px;text-align:right;font-weight:700;color:#f97316;font-size:13px;">Grand Total</td>
            <td style="padding:10px;text-align:right;font-weight:700;color:#f97316;font-size:13px;">${fmt(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    ${(formData.paymentTerms ?? []).length > 0 ? `
    <!-- Payment Terms -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:10px;">Payment Terms</h3>
      <table width="100%" cellpadding="6" cellspacing="0"><tr>${paymentHtml}</tr></table>
    </div>` : ""}

    ${(formData.terms ?? []).length > 0 ? `
    <!-- Terms & Conditions -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1e40af;padding-bottom:4px;margin-bottom:8px;">Terms &amp; Conditions</h3>
      <ol style="margin:0;padding-left:18px;color:#374151;font-size:12px;line-height:1.7;">
        ${(formData.terms ?? []).map((t: string) => `<li>${t}</li>`).join("")}
      </ol>
    </div>` : ""}

    <!-- Contact note -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#15803d;line-height:1.7;">
        For any queries regarding this quotation, please feel free to reach us:<br/>
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
      subject: subject || `Quotation${formData.quotationNumber ? ` ${formData.quotationNumber}` : ""} from GENCORE`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: any) {
    console.error("Send quotation error:", err)
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 })
  }
}
