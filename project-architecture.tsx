"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"

export default function ProjectArchitecture() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1e40af] mb-6">Gencore IT Stationery - Project Architecture</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsItem value="overview">Overview</TabsItem>
          <TabsItem value="frontend">Frontend</TabsItem>
          <TabsItem value="pdf">PDF Generation</TabsItem>
          <TabsItem value="design">Design System</TabsItem>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Project Overview</h2>

            <div className="space-y-4">
              <p>
                The Gencore IT Stationery project is a web application designed to create, edit, and generate
                professional business documents including letterheads, invoices, and quotations. It's built with modern
                web technologies to provide a responsive and user-friendly experience.
              </p>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Interactive document editors with real-time preview</li>
                  <li>PDF generation for professional document sharing</li>
                  <li>Local storage for saving drafts</li>
                  <li>Responsive design for desktop and mobile use</li>
                  <li>Print-optimized layouts</li>
                  <li>Random data generation for testing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Technology Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">Frontend</h4>
                    <p className="text-sm text-gray-600">Next.js & React</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">Styling</h4>
                    <p className="text-sm text-gray-600">Tailwind CSS</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">PDF Generation</h4>
                    <p className="text-sm text-gray-600">html2canvas & jsPDF</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">State Management</h4>
                    <p className="text-sm text-gray-600">React Hooks</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">Data Persistence</h4>
                    <p className="text-sm text-gray-600">Local Storage</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <h4 className="font-medium">Icons</h4>
                    <p className="text-sm text-gray-600">Lucide React</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frontend" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Frontend Architecture</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Component Structure</h3>
                <p className="mb-4">
                  The application follows a component-based architecture with reusable UI components:
                </p>

                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`App
├── TemplateSelector
│   ├── LetterheadEditor
│   │   └── Letterhead (Preview)
│   ├── InvoiceEditor
│   │   └── Invoice (Preview)
│   └── QuotationEditor
│       └── Quotation (Preview)
├── UI Components
│   ├── Button
│   ├── Input
│   ├── Textarea
│   ├── Label
│   ├── Dialog
│   └── Tabs`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">State Management</h3>
                <p>The application uses React's useState hook for component-level state management:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Form data for each document type</li>
                  <li>UI state (active tabs, dialogs, etc.)</li>
                  <li>Preview and print references</li>
                </ul>

                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Example State Structure</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`const [formData, setFormData] = useState({
  invoiceNumber: "INV-2023-001",
  date: "2023-01-01",
  dueDate: "2023-02-01",
  client: {
    name: "",
    company: "",
    address: "",
    phone: "",
    email: ""
  },
  items: [
    {
      id: "item-1",
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0
    }
  ],
  taxRate: 16,
  bankDetails: {...},
  notes: ""
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Persistence</h3>
                <p>The application uses browser's localStorage to save and load drafts:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Save draft
const handleSave = () => {
  const savedData = JSON.stringify(formData);
  localStorage.setItem("invoice_draft", savedData);
};

// Load draft
const handleLoad = () => {
  const savedData = localStorage.getItem("invoice_draft");
  if (savedData) {
    setFormData(JSON.parse(savedData));
  }
};`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">PDF Generation</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">PDF Generation Process</h3>
                <p>The application uses a two-step process to generate PDFs:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Convert HTML to Canvas using html2canvas</li>
                  <li>Convert Canvas to PDF using jsPDF</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">PDF Generator Utility</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(element: HTMLElement, filename: string): Promise<void> {
  // Wait for images to load
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Remove any unwanted URLs
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
      // Additional cleanup in cloned document
      onclone: (document) => {
        // Clean up unwanted elements
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

    // Handle multi-page documents
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
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Page Break Handling</h3>
                <p>For documents with many items, conditional page breaks are implemented:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Determine if we need a page break based on item count
const needsPageBreak = formData.items.length > 8

// In the JSX:
{needsPageBreak && <div className="page-break"></div>}

// CSS for page breaks
@media print {
  .page-break {
    page-break-after: always;
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Design System</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Typography</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Font Family</h4>
                    <p className="text-sm text-gray-600">Inter with system font fallbacks</p>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="font-sans text-2xl">Heading Text</p>
                      <p className="font-sans">
                        Body text with <span className="font-medium">medium</span> and{" "}
                        <span className="font-bold">bold</span> variations.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Heading Sizes</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-2xl">Heading 1 (text-2xl)</p>
                        <p className="text-xl">Heading 2 (text-xl)</p>
                        <p className="text-lg">Heading 3 (text-lg)</p>
                        <p className="text-md">Heading 4 (text-md)</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Text Sizes</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-base">Base text (text-base)</p>
                        <p className="text-sm">Small text (text-sm)</p>
                        <p className="text-xs">Extra small (text-xs)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Color Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-20 rounded-md bg-[#1e40af]"></div>
                    <p className="mt-1 text-sm font-medium">Primary Blue</p>
                    <p className="text-xs text-gray-500">#1e40af</p>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-[#f97316]"></div>
                    <p className="mt-1 text-sm font-medium">Secondary Orange</p>
                    <p className="text-xs text-gray-500">#f97316</p>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-gray-50"></div>
                    <p className="mt-1 text-sm font-medium">Background Gray</p>
                    <p className="text-xs text-gray-500">#f9fafb</p>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-gray-700"></div>
                    <p className="mt-1 text-sm font-medium">Text Gray</p>
                    <p className="text-xs text-gray-500">#374151</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">UI Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Buttons</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-[#1e40af] text-white rounded-md text-sm font-medium">
                        Primary Button
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
                        Secondary Button
                      </button>
                      <button className="px-4 py-2 text-[#1e40af] rounded-md text-sm font-medium">Text Button</button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Form Elements</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Text Input"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <textarea
                        placeholder="Textarea"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Print Styles</h3>
                <p>Special styles are applied for print media:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`@media print {
  /* Remove UI elements */
  button, .no-print {
    display: none !important;
  }
  
  /* Remove shadows and borders */
  .print:shadow-none print:border-0 {
    box-shadow: none !important;
    border: none !important;
  }
  
  /* Ensure backgrounds print */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  /* Page breaks */
  .page-break {
    page-break-after: always;
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
