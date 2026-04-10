"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, Save, FileUp, Printer, Plus, Trash2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { generatePDF } from "@/utils/pdf-generator"
import { catalogItems } from "@/lib/predefined-items"

interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

export default function InvoiceEditor() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [catalogValue, setCatalogValue] = useState("")

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    dueDate: "",
    companyInfo: {
      address: "4th Floor, Saeed Alam Tower, Liberty Market, Lahore",
      phone: "+92 332 0000911",
      email: "nauman@gencoreit.com",
      website: "www.gencoreit.com",
      description:
        "Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and Switches, along with comprehensive IT Solutions.",
    },
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
    ] as InvoiceItem[],
    taxRate: 16,
    bankDetails: {
      bankName: "",
      accountTitle: "",
      iban: "",
      accountNumber: "",
      swiftCode: "",
    },
    notes: "Thank you for your business. Payment is due within 30 days of invoice date.",
  })

  useEffect(() => {
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 30)
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: "INV-" + today.getFullYear() + "-" + String(Math.floor(Math.random() * 900) + 100),
      date: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const parts = name.split(".")
      if (parts.length === 2) {
        const [parent, child] = parts
        setFormData({
          ...formData,
          [parent]: {
            ...(formData[parent as keyof typeof formData] as Record<string, unknown>),
            [child]: value,
          },
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
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
          id: `item-${Date.now()}`,
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    })
  }

  const addFromCatalog = (catalogIndex: string) => {
    const idx = parseInt(catalogIndex, 10)
    if (isNaN(idx) || idx < 0) return
    const product = catalogItems[idx]
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: `item-${Date.now()}`,
          name: product.name,
          description: product.description,
          quantity: 1,
          unitPrice: product.price,
        },
      ],
    })
    setCatalogValue("")
    toast({ title: "Item added", description: `${product.name} added to invoice` })
  }

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((item) => item.id !== id) })
    } else {
      toast({ title: "Cannot remove item", description: "You must have at least one item", variant: "destructive" })
    }
  }

  const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const calculateTax = () => calculateSubtotal() * (formData.taxRate / 100)
  const calculateTotal = () => calculateSubtotal() + calculateTax()
  const formatCurrency = (amount: number) => "PKR " + new Intl.NumberFormat("en-PK").format(amount)

  const handleDownloadPDF = async () => {
    const element = previewRef.current || printRef.current
    if (element) {
      try {
        await generatePDF(element, `Invoice_${formData.invoiceNumber}.pdf`)
        toast({ title: "PDF Generated", description: "Your invoice has been downloaded successfully" })
      } catch {
        toast({ title: "Error", description: "Failed to generate PDF. Please try again.", variant: "destructive" })
      }
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const styleSheets = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
          .map((el) => el.outerHTML)
          .join("\n")
        printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice</title>${styleSheets}<style>@media print{@page{size:A4;margin:10mm;}body{margin:0;background:white;}}</style></head><body style="background:white;">${printContent}</body></html>`)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => { printWindow.print(); printWindow.close() }, 1200)
      }
    }
  }

  const handleSave = () => {
    localStorage.setItem("invoice_draft", JSON.stringify(formData))
    toast({ title: "Draft saved", description: "Your invoice draft has been saved locally" })
  }

  const handleLoad = () => {
    const savedData = localStorage.getItem("invoice_draft")
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
        toast({ title: "Draft loaded", description: "Your saved invoice draft has been loaded" })
      } catch {
        localStorage.removeItem("invoice_draft")
        toast({ title: "Load failed", description: "Saved draft was corrupted and has been cleared", variant: "destructive" })
      }
    } else {
      toast({ title: "No saved draft", description: "No saved invoice draft was found", variant: "destructive" })
    }
  }

  const PreviewContent = ({ forPDF = false }: { forPDF?: boolean }) => {
    const p = forPDF ? "p-1 px-2" : "py-2 px-3"
    const rowText = "text-xs"
    return (
    <div className={forPDF ? "print-optimized bg-white" : "w-full p-6"} style={forPDF ? { padding: "20px 28px", fontSize: "11px" } : {}}>
      {/* Header */}
      <div className={`flex justify-between items-start border-b ${forPDF ? "pb-2 mb-1" : "pb-4 mb-2"}`}>
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Right%20Logo-pcG5xhUOcBvEaMtBemNZplMKUox6rR.png"
            alt="Gencore IT Solutions Logo"
            width={forPDF ? 40 : 55}
            height={forPDF ? 40 : 55}
            className="object-contain"
          />
          <div>
            <h1 className={`font-bold text-[#1e40af] ${forPDF ? "text-base" : "text-2xl"}`}>Gencore IT Solutions</h1>
            <p className="text-[#f97316] font-medium" style={forPDF ? { fontSize: "10px" } : { fontSize: "12px" }}>Next Generation Core IT Solutions</p>
          </div>
        </div>
        <div className="text-right text-gray-600" style={{ fontSize: "10px" }}>
          <p>{formData.companyInfo.address}</p>
          <p>Phone: {formData.companyInfo.phone}</p>
          <p>Email: {formData.companyInfo.email}</p>
          {formData.companyInfo.website && <p>{formData.companyInfo.website}</p>}
        </div>
      </div>

      {/* Description */}
      <div className={`text-gray-600 ${forPDF ? "my-1" : "my-3"}`} style={{ fontSize: "10px" }}>
        <p>{formData.companyInfo.description}</p>
      </div>

      {/* Title */}
      <div className={`text-center ${forPDF ? "my-2" : "my-3"}`}>
        <h2 className={`font-bold text-[#1e40af] uppercase ${forPDF ? "text-base" : "text-xl"}`}>Invoice</h2>
      </div>

      {/* Client + Invoice details */}
      <div className={`flex justify-between gap-3 ${forPDF ? "mb-2" : "mb-4"}`}>
        <div className={`bg-gray-50 rounded-md border border-gray-100 flex-1 ${forPDF ? "p-2" : "p-3"}`}>
          <h3 className={`font-semibold text-[#1e40af] ${forPDF ? "text-xs mb-0.5" : "text-sm mb-1"}`}>Bill To:</h3>
          <div className="space-y-0" style={{ fontSize: "10px" }}>
            <p><span className="font-medium">Client Name:</span> {formData.client.name || "________________"}</p>
            <p><span className="font-medium">Company:</span> {formData.client.company || "________________"}</p>
            <p><span className="font-medium">Address:</span> {formData.client.address || "________________"}</p>
            <p><span className="font-medium">Phone:</span> {formData.client.phone || "________________"}</p>
            <p><span className="font-medium">Email:</span> {formData.client.email || "________________"}</p>
          </div>
        </div>
        <div className={`bg-gray-50 rounded-md border border-gray-100 w-1/3 ${forPDF ? "p-2" : "p-3"}`}>
          <h3 className={`font-semibold text-[#1e40af] ${forPDF ? "text-xs mb-0.5" : "text-sm mb-1"}`}>Invoice Details:</h3>
          <div className="grid grid-cols-2 gap-x-1" style={{ fontSize: "10px" }}>
            <p className="font-medium">Invoice Number:</p>
            <p>{formData.invoiceNumber}</p>
            <p className="font-medium">Date Issued:</p>
            <p>{formData.date ? new Date(formData.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</p>
            <p className="font-medium">Due Date:</p>
            <p>{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</p>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className={forPDF ? "mb-2" : "mb-4"}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${p} text-left bg-[#1e40af] text-white font-semibold w-10 ${rowText}`}>SR#</th>
              <th className={`${p} text-left bg-[#1e40af] text-white font-semibold w-1/2 ${rowText}`}>Item Description</th>
              <th className={`${p} text-center bg-[#1e40af] text-white font-semibold w-1/6 ${rowText}`}>Qty</th>
              <th className={`${p} text-right bg-[#1e40af] text-white font-semibold w-1/6 ${rowText}`}>Unit Price</th>
              <th className={`${p} text-right bg-[#1e40af] text-white font-semibold w-1/6 ${rowText}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className={`${p} text-center text-gray-700 ${rowText}`}>{index + 1}</td>
                <td className={`${p} text-gray-700 ${rowText}`}>
                  <p className="font-medium leading-tight">{item.name || "Item Name"}</p>
                  {item.description && <p className="text-gray-500 leading-tight" style={{ fontSize: "9px" }}>{item.description}</p>}
                </td>
                <td className={`${p} text-center text-gray-700 ${rowText}`}>{item.quantity}</td>
                <td className={`${p} text-right text-gray-700 ${rowText}`}>{formatCurrency(item.unitPrice)}</td>
                <td className={`${p} text-right text-gray-700 ${rowText}`}>{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={`flex justify-end ${forPDF ? "mb-2" : "mb-4"}`}>
        <div className={`w-1/3 bg-gray-50 rounded-md border border-gray-100 ${forPDF ? "p-1.5" : "p-3"}`}>
          <div className={`flex justify-between border-b border-gray-200 ${rowText} ${forPDF ? "py-0.5" : "py-1"}`}>
            <span className="font-medium text-gray-700">Subtotal:</span>
            <span className="text-gray-700">{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className={`flex justify-between border-b border-gray-200 ${rowText} ${forPDF ? "py-0.5" : "py-1"}`}>
            <span className="font-medium text-gray-700">Tax ({formData.taxRate}%):</span>
            <span className="text-gray-700">{formatCurrency(calculateTax())}</span>
          </div>
          <div className={`flex justify-between font-bold ${rowText} ${forPDF ? "py-0.5" : "py-1"}`}>
            <span className="text-[#1e40af]">Grand Total:</span>
            <span className="text-[#1e40af]">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className={forPDF ? "mb-2" : "mb-4"}>
        <h3 className={`font-semibold text-[#1e40af] ${forPDF ? "text-xs mb-0.5" : "text-sm mb-1"}`}>Payment Instructions</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0" style={{ fontSize: "10px" }}>
          <div><span className="font-medium">Bank Name:</span> {formData.bankDetails.bankName || "________________"}</div>
          <div><span className="font-medium">Account Title:</span> {formData.bankDetails.accountTitle || "________________"}</div>
          <div><span className="font-medium">Account Number:</span> {formData.bankDetails.accountNumber || "________________"}</div>
          <div><span className="font-medium">IBAN:</span> {formData.bankDetails.iban || "________________"}</div>
          <div><span className="font-medium">Swift Code:</span> {formData.bankDetails.swiftCode || "________________"}</div>
        </div>
      </div>

      {/* Notes */}
      <div className={forPDF ? "mb-2" : "mb-4"}>
        <h3 className={`font-semibold text-[#1e40af] ${forPDF ? "text-xs mb-0.5" : "text-sm mb-1"}`}>Notes</h3>
        <p className="text-gray-600" style={{ fontSize: "10px" }}>{formData.notes}</p>
      </div>

      {/* Footer */}
      <div className={`pt-2 border-t border-gray-200 text-center ${forPDF ? "mt-3" : "mt-6"}`}>
        <p className={`text-[#1e40af] font-medium ${rowText}`}>Next Generation Core IT Solutions</p>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: "10px" }}>
          {formData.companyInfo.phone} | {formData.companyInfo.email} | {formData.companyInfo.website}
        </p>
      </div>
    </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left panel: Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Invoice Details</h2>

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input type="text" id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            </div>

            {/* Items — at the top after basic info, with scrollable list */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-[#1e40af]">Items</h3>
                <span className="text-xs text-gray-400">{formData.items.length} item(s)</span>
              </div>

              {/* Catalog quick-add dropdown */}
              <div className="mb-3">
                <Label>Quick Add from Catalog</Label>
                <select
                  value={catalogValue}
                  onChange={(e) => {
                    setCatalogValue(e.target.value)
                    if (e.target.value !== "") addFromCatalog(e.target.value)
                  }}
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                >
                  <option value="">-- Select a product to add --</option>
                  {catalogItems.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.name} — PKR {new Intl.NumberFormat("en-PK").format(item.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scrollable items list */}
              <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-7 w-7 p-0">
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`item-${item.id}-name`} className="text-xs">Item Name</Label>
                      <Input
                        type="text"
                        id={`item-${item.id}-name`}
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        placeholder="Product/Service Name"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-${item.id}-description`} className="text-xs">Description</Label>
                      <Textarea
                        id={`item-${item.id}-description`}
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        rows={2}
                        className="resize-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`item-${item.id}-quantity`} className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          id={`item-${item.id}-quantity`}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                          min="1"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`item-${item.id}-price`} className="text-xs">Unit Price</Label>
                        <Input
                          type="number"
                          id={`item-${item.id}-price`}
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={addItem} className="w-full mt-3 flex items-center justify-center gap-2">
                <Plus size={16} />
                Add Item Manually
              </Button>
            </div>

            {/* Client Info */}
            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="client.name">Client Name</Label>
                  <Input type="text" id="client.name" name="client.name" placeholder="John Doe" value={formData.client.name} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="client.company">Company</Label>
                  <Input type="text" id="client.company" name="client.company" placeholder="ABC Corporation" value={formData.client.company} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="client.address">Address</Label>
                  <Input type="text" id="client.address" name="client.address" placeholder="123 Business St, City" value={formData.client.address} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="client.phone">Phone</Label>
                  <Input type="text" id="client.phone" name="client.phone" placeholder="+92 300 0000000" value={formData.client.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="client.email">Email</Label>
                  <Input type="email" id="client.email" name="client.email" placeholder="client@example.com" value={formData.client.email} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="pt-2 border-t border-gray-200">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} min="0" max="100" step="0.01" />
            </div>

            {/* Bank Details */}
            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="bankDetails.bankName">Bank Name</Label>
                  <Input type="text" id="bankDetails.bankName" name="bankDetails.bankName" placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="bankDetails.accountTitle">Account Title</Label>
                  <Input type="text" id="bankDetails.accountTitle" name="bankDetails.accountTitle" placeholder="Account Title" value={formData.bankDetails.accountTitle} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="bankDetails.accountNumber">Account Number</Label>
                  <Input type="text" id="bankDetails.accountNumber" name="bankDetails.accountNumber" placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="bankDetails.iban">IBAN</Label>
                  <Input type="text" id="bankDetails.iban" name="bankDetails.iban" placeholder="IBAN" value={formData.bankDetails.iban} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="bankDetails.swiftCode">Swift Code</Label>
                  <Input type="text" id="bankDetails.swiftCode" name="bankDetails.swiftCode" placeholder="Swift Code" value={formData.bankDetails.swiftCode} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-2 border-t border-gray-200">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="resize-none" />
            </div>

            {/* Company Info (editable) */}
            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Our Company Info</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="companyInfo.email">Contact Email</Label>
                  <Input type="email" id="companyInfo.email" name="companyInfo.email" value={formData.companyInfo.email} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="companyInfo.phone">Phone</Label>
                  <Input type="text" id="companyInfo.phone" name="companyInfo.phone" value={formData.companyInfo.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="companyInfo.address">Address</Label>
                  <Input type="text" id="companyInfo.address" name="companyInfo.address" value={formData.companyInfo.address} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="companyInfo.website">Website</Label>
                  <Input type="text" id="companyInfo.website" name="companyInfo.website" value={formData.companyInfo.website} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="companyInfo.description">Business Description</Label>
                  <Textarea id="companyInfo.description" name="companyInfo.description" value={formData.companyInfo.description} onChange={handleChange} rows={3} className="resize-none text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
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
                  <DialogTitle>Invoice Preview</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div ref={previewRef}>
                    <PreviewContent forPDF={true} />
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                  <Button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1e3a8a]">
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

      {/* Right panel: Live preview */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div ref={printRef}>
              <PreviewContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
