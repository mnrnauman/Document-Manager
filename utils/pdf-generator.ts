import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(element: HTMLElement, filename: string): Promise<void> {
  // Wait for any images to load
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Remove any Vercel SSO URLs that might be in the document
    const links = element.querySelectorAll('a[href*="vercel.com/sso/access/request"]')
    links.forEach((link) => {
      link.removeAttribute("href")
    })

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      // Ignore any elements with URLs we don't want
      onclone: (document) => {
        const clonedElement = document.body.querySelector(".print-optimized") as HTMLElement
        if (clonedElement) {
          const unwantedElements = clonedElement.querySelectorAll('[href*="vercel.com"]')
          unwantedElements.forEach((el) => {
            el.removeAttribute("href")
            if (el.textContent && el.textContent.includes("vercel.com")) {
              el.textContent = ""
            }
          })
        }
      },
    })

    // Calculate dimensions to fit on A4
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")

    // Add image to PDF
    pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, imgWidth, imgHeight)

    // If content overflows a page, add additional pages
    let heightLeft = imgHeight
    let position = 0

    while (heightLeft > pageHeight) {
      position = heightLeft - pageHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, -position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(filename)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("There was an error generating the PDF. Please try again.")
  }
}
