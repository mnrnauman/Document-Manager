"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, Save, FileUp, Printer, Plus, Trash2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { generatePDF } from "@/utils/pdf-generator"

interface QuotationItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

export default function QuotationEditor() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [formData, setFormData] = useState({
    quotationNumber: "QT-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    client: {
      name: "",
      company: "",
      address: "",
      phone: "",
      email: "",
    },
    items: [
      {
        id: "item-1",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ] as QuotationItem[],
    taxRate: 16,
    terms: [
      "This quotation is valid for 30 days from the date of issue.",
      "50% advance payment is required to initiate the project.",
      "Prices are subject to change if requirements are modified.",
      "Delivery timeline will be finalized upon project confirmation.",
      "Payment terms: Remaining 50% upon project completion.",
      "All hardware comes with manufacturer warranty as specified.",
      "Installation and configuration services are included unless otherwise specified.",
      "Prices are exclusive of any applicable taxes unless specified.",
    ],
    notes: "Thank you for considering Gencore IT Solutions. We look forward to working with you.",
    authorizedBy: "",
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

  const handleItemChange = (id: string, field: keyof QuotationItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: `item-${formData.items.length + 1}`,
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    })
  }

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      })
    } else {
      toast({
        title: "Cannot remove item",
        description: "You must have at least one item in the quotation",
        variant: "destructive",
      })
    }
  }

  const handleTermChange = (index: number, value: string) => {
    const newTerms = [...formData.terms]
    newTerms[index] = value
    setFormData({
      ...formData,
      terms: newTerms,
    })
  }

  const addTerm = () => {
    setFormData({
      ...formData,
      terms: [...formData.terms, ""],
    })
  }

  const removeTerm = (index: number) => {
    if (formData.terms.length > 1) {
      setFormData({
        ...formData,
        terms: formData.terms.filter((_, i) => i !== index),
      })
    } else {
      toast({
        title: "Cannot remove term",
        description: "You must have at least one term in the quotation",
        variant: "destructive",
      })
    }
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Updated to use PKR currency
  const formatCurrency = (amount: number) => {
    return "PKR " + new Intl.NumberFormat("en-PK").format(amount)
  }

  // Improved PDF generation using our utility
  const handleDownloadPDF = async () => {
    if (previewRef.current) {
      try {
        await generatePDF(previewRef.current, `Quotation_${formData.quotationNumber}.pdf`)
        toast({
          title: "PDF Generated",
          description: "Your quotation has been downloaded successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = `
        <html>
          <head>
            <title>Print Quotation</title>
            <style>
              body { font-family: Arial, sans-serif; }
              @page { size: A4; margin: 15mm; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `

      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  const handleSave = () => {
    const savedData = JSON.stringify(formData)
    localStorage.setItem("quotation_draft", savedData)
    toast({
      title: "Draft saved",
      description: "Your quotation draft has been saved locally",
    })
  }

  const handleLoad = () => {
    const savedData = localStorage.getItem("quotation_draft")
    if (savedData) {
      setFormData(JSON.parse(savedData))
      toast({
        title: "Draft loaded",
        description: "Your saved quotation draft has been loaded",
      })
    } else {
      toast({
        title: "No saved draft",
        description: "No saved quotation draft was found",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Quotation Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="quotationNumber">Quotation Number</Label>
              <Input
                type="text"
                id="quotationNumber"
                name="quotationNumber"
                value={formData.quotationNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                type="date"
                id="validUntil"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Client Information</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="client.name">Client Name</Label>
                  <Input
                    type="text"
                    id="client.name"
                    name="client.name"
                    placeholder="John Doe"
                    value={formData.client.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="client.company">Company</Label>
                  <Input
                    type="text"
                    id="client.company"
                    name="client.company"
                    placeholder="ABC Corporation"
                    value={formData.client.company}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="client.address">Address</Label>
                  <Input
                    type="text"
                    id="client.address"
                    name="client.address"
                    placeholder="123 Business St, City"
                    value={formData.client.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="client.phone">Phone</Label>
                  <Input
                    type="text"
                    id="client.phone"
                    name="client.phone"
                    placeholder="+1 234 567 8900"
                    value={formData.client.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="client.email">Email</Label>
                  <Input
                    type="email"
                    id="client.email"
                    name="client.email"
                    placeholder="client@example.com"
                    value={formData.client.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Items</h3>

              {formData.items.map((item, index) => (
                <div key={item.id} className="space-y-3 mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Item #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor={`item-${item.id}-name`}>Item Name</Label>
                    <Input
                      type="text"
                      id={`item-${item.id}-name`}
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                      placeholder="Product/Service Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                    <Textarea
                      id={`item-${item.id}-description`}
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`item-${item.id}-quantity`}>Quantity</Label>
                      <Input
                        type="number"
                        id={`item-${item.id}-quantity`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`item-${item.id}-price`}>Unit Price</Label>
                      <Input
                        type="number"
                        id={`item-${item.id}-price`}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Item
              </Button>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Terms and Conditions</h3>

              {formData.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <Textarea
                    value={term}
                    onChange={(e) => handleTermChange(index, e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTerm(index)}
                    className="h-8 w-8 p-0 mt-1"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addTerm}
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Term
              </Button>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <Label htmlFor="authorizedBy">Authorized By</Label>
              <Input
                type="text"
                id="authorizedBy"
                name="authorizedBy"
                placeholder="Your Name"
                value={formData.authorizedBy}
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
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Eye size={16} />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Quotation Preview</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div ref={previewRef} className="print-optimized p-8 bg-white">
                    {/* Header with logo and company info */}
                    <div className="flex justify-between items-start border-b pb-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Right%20Logo-pcG5xhUOcBvEaMtBemNZplMKUox6rR.png"
                          alt="Gencore IT Solutions Logo"
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                        <div>
                          <h1 className="text-xl font-bold text-[#1e40af]">Gencore IT Solutions</h1>
                          <p className="text-[#f97316] text-xs font-medium">Next Generation Core IT Solutions</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-600">
                        <p>4th Floor, Saeed Alam Tower,</p>
                        <p>Liberty Market, Lahore</p>
                        <p>Phone: +92 332 0000911</p>
                        <p>Email: nauman@gencoreit.com</p>
                      </div>
                    </div>

                    {/* Business Description */}
                    <div className="mt-3 mb-4 text-xs text-gray-600">
                      <p>
                        Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and
                        Switches, along with comprehensive IT Solutions.
                      </p>
                    </div>

                    {/* Quotation Title */}
                    <div className="my-4 text-center">
                      <h2 className="text-xl font-bold text-[#1e40af] uppercase">Quotation</h2>
                    </div>

                    {/* Quotation Details */}
                    <div className="flex justify-between mb-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 flex-1">
                        <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Client Information:</h3>
                        <div className="text-xs space-y-0.5">
                          <p>
                            <span className="font-medium">Client Name:</span>{" "}
                            {formData.client.name || "________________"}
                          </p>
                          <p>
                            <span className="font-medium">Company:</span>{" "}
                            {formData.client.company || "________________"}
                          </p>
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {formData.client.address || "________________"}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span> {formData.client.phone || "________________"}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {formData.client.email || "________________"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 w-1/3">
                        <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Quotation Details:</h3>
                        <div className="text-xs grid grid-cols-2 gap-1">
                          <p className="font-medium">Quotation Number:</p>
                          <p>{formData.quotationNumber}</p>

                          <p className="font-medium">Date:</p>
                          <p>
                            {formData.date
                              ? new Date(formData.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </p>

                          <p className="font-medium">Valid Until:</p>
                          <p>
                            {formData.validUntil
                              ? new Date(formData.validUntil).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quotation Items */}
                    <div className="my-4">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-2 px-3 text-left bg-[#f97316] text-white rounded-tl-md font-semibold w-1/2">
                              Item Description
                            </th>
                            <th className="py-2 px-3 text-center bg-[#f97316] text-white font-semibold w-1/6">
                              Quantity
                            </th>
                            <th className="py-2 px-3 text-right bg-[#f97316] text-white font-semibold w-1/6">
                              Unit Price
                            </th>
                            <th className="py-2 px-3 text-right bg-[#f97316] text-white rounded-tr-md font-semibold w-1/6">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-700 text-xs">
                                <div>
                                  <p className="font-medium">{item.name || "Item Name"}</p>
                                  {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center text-gray-700 text-xs">{item.quantity}</td>
                              <td className="py-2 px-3 text-right text-gray-700 text-xs">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td className="py-2 px-3 text-right text-gray-700 text-xs">
                                {formatCurrency(item.quantity * item.unitPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-4">
                      <div className="w-1/3 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <div className="flex justify-between py-1 border-b border-gray-200 text-xs">
                          <span className="font-medium text-gray-700">Subtotal:</span>
                          <span className="text-gray-700">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 text-xs">
                          <span className="font-medium text-gray-700">Tax ({formData.taxRate}%):</span>
                          <span className="text-gray-700">{formatCurrency(calculateTax())}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-xs">
                          <span className="text-[#f97316]">Grand Total:</span>
                          <span className="text-[#f97316]">{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Terms and Conditions</h3>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-0.5">
                        {formData.terms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Notes</h3>
                      <p className="text-xs text-gray-600">{formData.notes}</p>
                    </div>

                    {/* Acceptance */}
                    <div className="mb-4 mt-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-700 mb-1">Authorized by (Gencore IT Solutions):</p>
                          <div className="border-b border-gray-300 h-6 mb-1"></div>
                          <p className="text-xs text-gray-500">{formData.authorizedBy || "Name & Signature"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-700 mb-1">Accepted by (Client):</p>
                          <div className="border-b border-gray-300 h-6 mb-1"></div>
                          <p className="text-xs text-gray-500">Name, Signature & Date</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-2 border-t border-gray-200 text-center">
                      <p className="text-xs text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
                      <p className="text-xs text-gray-500 mt-0.5">+92 332 0000911 | nauman@gencoreit.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1e3a8a]"
                  >
                    <Download size={16} />
                    Download PDF
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1e3a8a]">
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
              {/* Header with logo and company info */}
              <div className="flex justify-between items-start border-b pb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Right%20Logo-pcG5xhUOcBvEaMtBemNZplMKUox6rR.png"
                    alt="Gencore IT Solutions Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-[#1e40af]">Gencore IT Solutions</h1>
                    <p className="text-[#f97316] text-xs font-medium">Next Generation Core IT Solutions</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-600">
                  <p>4th Floor, Saeed Alam Tower,</p>
                  <p>Liberty Market, Lahore</p>
                  <p>Phone: +92 332 0000911</p>
                  <p>Email: nauman@gencoreit.com</p>
                </div>
              </div>

              {/* Business Description */}
              <div className="mt-3 mb-4 text-xs text-gray-600">
                <p>
                  Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and
                  Switches, along with comprehensive IT Solutions.
                </p>
              </div>

              {/* Quotation Title */}
              <div className="my-4 text-center">
                <h2 className="text-xl font-bold text-[#1e40af] uppercase">Quotation</h2>
              </div>

              {/* Quotation Details */}
              <div className="flex justify-between mb-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100 flex-1">
                  <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Client Information:</h3>
                  <div className="text-xs space-y-0.5">
                    <p>
                      <span className="font-medium">Client Name:</span> {formData.client.name || "________________"}
                    </p>
                    <p>
                      <span className="font-medium">Company:</span> {formData.client.company || "________________"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {formData.client.address || "________________"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {formData.client.phone || "________________"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {formData.client.email || "________________"}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100 w-1/3">
                  <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Quotation Details:</h3>
                  <div className="text-xs grid grid-cols-2 gap-1">
                    <p className="font-medium">Quotation Number:</p>
                    <p>{formData.quotationNumber}</p>

                    <p className="font-medium">Date:</p>
                    <p>
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>

                    <p className="font-medium">Valid Until:</p>
                    <p>
                      {formData.validUntil
                        ? new Date(formData.validUntil).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quotation Items */}
              <div className="my-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left bg-[#f97316] text-white rounded-tl-md font-semibold w-1/2">
                        Item Description
                      </th>
                      <th className="py-2 px-3 text-center bg-[#f97316] text-white font-semibold w-1/6">Quantity</th>
                      <th className="py-2 px-3 text-right bg-[#f97316] text-white font-semibold w-1/6">Unit Price</th>
                      <th className="py-2 px-3 text-right bg-[#f97316] text-white rounded-tr-md font-semibold w-1/6">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-700 text-xs">
                          <div>
                            <p className="font-medium">{item.name || "Item Name"}</p>
                            {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center text-gray-700 text-xs">{item.quantity}</td>
                        <td className="py-2 px-3 text-right text-gray-700 text-xs">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2 px-3 text-right text-gray-700 text-xs">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-4">
                <div className="w-1/3 bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="flex justify-between py-1 border-b border-gray-200 text-xs">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="text-gray-700">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 text-xs">
                    <span className="font-medium text-gray-700">Tax ({formData.taxRate}%):</span>
                    <span className="text-gray-700">{formatCurrency(calculateTax())}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-xs">
                    <span className="text-[#f97316]">Grand Total:</span>
                    <span className="text-[#f97316]">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Terms and Conditions</h3>
                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-0.5">
                  {formData.terms.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Notes</h3>
                <p className="text-xs text-gray-600">{formData.notes}</p>
              </div>

              {/* Acceptance */}
              <div className="mb-4 mt-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Authorized by (Gencore IT Solutions):</p>
                    <div className="border-b border-gray-300 h-6 mb-1"></div>
                    <p className="text-xs text-gray-500">{formData.authorizedBy || "Name & Signature"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Accepted by (Client):</p>
                    <div className="border-b border-gray-300 h-6 mb-1"></div>
                    <p className="text-xs text-gray-500">Name, Signature & Date</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-2 border-t border-gray-200 text-center">
                <p className="text-xs text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
                <p className="text-xs text-gray-500 mt-0.5">+92 332 0000911 | nauman@gencoreit.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
