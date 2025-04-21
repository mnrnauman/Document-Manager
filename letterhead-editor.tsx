"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, Save, FileUp, Printer } from "lucide-react"

export default function LetterheadEditor() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    recipient: {
      name: "",
      company: "",
      address: "",
    },
    subject: "",
    content: "",
    signature: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, unknown>),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Enhanced PDF generation with improved styling
  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const originalContent = document.body.innerHTML

      // Create a print-friendly version with improved styling
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Letterhead_${new Date().toISOString().split("T")[0]}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  margin: 0;
                  padding: 0;
                  color: #333;
                }
                
                .print-container {
                  padding: 20mm;
                  max-width: 210mm;
                  margin: 0 auto;
                  background-color: white;
                }
                
                @media print {
                  body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  button, .no-print {
                    display: none !important;
                  }
                  
                  .print-container {
                    padding: 0;
                    width: 100%;
                    max-width: 100%;
                  }
                  
                  /* Ensure backgrounds and colors print correctly */
                  * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                }
                
                /* Preserve gradients and shadows */
                .gradient-accent {
                  background: linear-gradient(to right, #1e40af, #f97316);
                  height: 4px;
                  width: 100%;
                  position: relative;
                }
                
                .shadow-effect {
                  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }
                
                /* Ensure proper spacing */
                .content-section {
                  margin-bottom: 1.5rem;
                }
                
                /* Table styling */
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                
                th {
                  background-color: #1e40af;
                  color: white;
                  text-align: left;
                  padding: 0.75rem 1rem;
                }
                
                td {
                  padding: 0.75rem 1rem;
                  border-bottom: 1px solid #e5e7eb;
                }
                
                /* Ensure proper image rendering */
                img {
                  max-width: 100%;
                  height: auto;
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                ${printContent}
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  const handleSave = () => {
    const savedData = JSON.stringify(formData)
    localStorage.setItem("letterhead_draft", savedData)
    toast({
      title: "Draft saved",
      description: "Your letterhead draft has been saved locally",
    })
  }

  const handleLoad = () => {
    const savedData = localStorage.getItem("letterhead_draft")
    if (savedData) {
      setFormData(JSON.parse(savedData))
      toast({
        title: "Draft loaded",
        description: "Your saved letterhead draft has been loaded",
      })
    } else {
      toast({
        title: "No saved draft",
        description: "No saved letterhead draft was found",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Letterhead Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="recipient.name">Recipient Name</Label>
              <Input
                type="text"
                id="recipient.name"
                name="recipient.name"
                placeholder="John Doe"
                value={formData.recipient.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="recipient.company">Recipient Company</Label>
              <Input
                type="text"
                id="recipient.company"
                name="recipient.company"
                placeholder="ABC Corporation"
                value={formData.recipient.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="recipient.address">Recipient Address</Label>
              <Input
                type="text"
                id="recipient.address"
                name="recipient.address"
                placeholder="123 Business St, City"
                value={formData.recipient.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                placeholder="Re: Business Proposal"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="content">Letter Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter your letter content here..."
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="resize-none"
              />
            </div>

            <div>
              <Label htmlFor="signature">Signature Name</Label>
              <Input
                type="text"
                id="signature"
                name="signature"
                placeholder="Your Name"
                value={formData.signature}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              Save Draft
            </Button>
            <Button onClick={handleLoad} variant="outline" className="flex items-center gap-2">
              <FileUp size={16} />
              Load Draft
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1e3a8a]">
              <Download size={16} />
              Download PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer size={16} />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Preview</h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div ref={printRef} className="w-full p-8">
              {/* Header with gradient accent */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#f97316]"></div>
                <div className="pt-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#f97316] rounded-full blur-sm opacity-30"></div>
                      <div className="relative">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Right%20Logo-pcG5xhUOcBvEaMtBemNZplMKUox6rR.png"
                          alt="Gencore IT Solutions Logo"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-[#1e40af]">Gencore IT Solutions</h1>
                      <p className="text-[#f97316] text-sm font-medium">Next Generation Core IT Solutions</p>
                    </div>
                  </div>
                  <div className="text-right mt-4 md:mt-0 text-sm text-gray-600">
                    <p>4th Floor, Saeed Alam Tower,</p>
                    <p>Liberty Market, Lahore</p>
                    <p>Phone: +92 332 0000911</p>
                    <p>Email: nauman@gencoreit.com</p>
                    <p>www.Gencoreit.com</p>
                  </div>
                </div>
              </div>

              {/* Business Description */}
              <div className="mt-4 mb-6 text-sm text-gray-600 italic border-l-2 border-[#1e40af] pl-3 bg-gray-50 py-2 rounded-r-md">
                <p>
                  Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and
                  Switches, along with comprehensive IT Solutions.
                </p>
              </div>

              {/* Date and Recipient */}
              <div className="mt-8">
                <div className="mb-6">
                  <p className="text-gray-700 flex items-center">
                    <span className="w-16 font-medium">Date:</span>
                    <span className="text-gray-700">
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </p>
                </div>
                <div className="mb-8">
                  <p className="text-gray-700 font-medium mb-2">To:</p>
                  <div className="pl-4 border-l-2 border-[#f97316]">
                    <p className="text-gray-700">{formData.recipient.name || "________________"}</p>
                    <p className="text-gray-700">{formData.recipient.company || "________________"}</p>
                    <p className="text-gray-700">{formData.recipient.address || "________________"}</p>
                  </div>
                </div>
              </div>

              {/* Subject Line */}
              <div className="mb-6">
                <p className="text-gray-700 flex items-center">
                  <span className="w-16 font-medium">Subject:</span>
                  <span className="text-gray-700">{formData.subject || "________________"}</span>
                </p>
              </div>

              {/* Letter Body */}
              <div className="min-h-[300px] border-b border-gray-200 pb-6 whitespace-pre-line">
                <p className="text-gray-700">{formData.content || "Letter content goes here..."}</p>
              </div>

              {/* Footer */}
              <div className="mt-8">
                <div className="mb-8">
                  <p className="text-gray-700">Sincerely,</p>
                  <div className="mt-8 mb-1 border-b border-gray-300 w-48"></div>
                  <p className="text-gray-700 font-medium">{formData.signature || "Gencore IT Solutions"}</p>
                </div>

                <div className="relative mt-12">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#f97316]"></div>
                  <div className="border-t border-gray-200 pt-4 pb-6 text-center">
                    <p className="text-sm text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
                    <p className="text-xs text-gray-500 mt-1">
                      www.Gencoreit.com | +92 332 0000911 | nauman@gencoreit.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
