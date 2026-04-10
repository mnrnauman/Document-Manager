import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(element: HTMLElement, filename: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const links = element.querySelectorAll('a[href*="vercel.com/sso/access/request"]')
    links.forEach((link) => link.removeAttribute("href"))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      onclone: (doc) => {
        const cloned = doc.body.querySelector(".print-optimized") as HTMLElement
        if (cloned) {
          cloned.querySelectorAll('[href*="vercel.com"]').forEach((el) => {
            el.removeAttribute("href")
            if (el.textContent?.includes("vercel.com")) el.textContent = ""
          })
        }
      },
    })

    const pdf = new jsPDF("p", "mm", "a4")
    const pageW = 210   // A4 width mm
    const pageH = 297   // A4 height mm

    const imgData = canvas.toDataURL("image/png")
    // Natural height if rendered at full A4 width
    const naturalH = (canvas.height * pageW) / canvas.width

    if (naturalH <= pageH * 1.15) {
      // Content fits on one page (with up to 15% overflow tolerance — scale to fit)
      const scale = Math.min(1, pageH / naturalH)
      const scaledW = pageW * scale
      const scaledH = naturalH * scale
      const xOffset = (pageW - scaledW) / 2
      pdf.addImage(imgData, "PNG", xOffset, 0, scaledW, scaledH)
    } else {
      // Multi-page: render full width across as many pages as needed
      pdf.addImage(imgData, "PNG", 0, 0, pageW, naturalH)
      let heightLeft = naturalH - pageH
      let position = pageH
      while (heightLeft > 0) {
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, -position, pageW, naturalH)
        position += pageH
        heightLeft -= pageH
      }
    }

    pdf.save(filename)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("There was an error generating the PDF. Please try again.")
  }
}
