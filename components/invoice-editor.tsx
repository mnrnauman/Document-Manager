"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, Save, FileUp, Printer, Plus, Trash2, Eye, FileSpreadsheet } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { generatePDF } from "@/utils/pdf-generator"

interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

// Sample data for random generation
const sampleCompanies = [
  "Tech Solutions Inc.",
  "Global Innovations",
  "Digital Dynamics",
  "Future Systems",
  "Smart Technologies",
  "Nexus Computing",
  "Apex IT Solutions",
  "Quantum Networks",
  "Cyber Systems",
  "Elite Technologies",
  "Prime Computing",
  "Stellar IT",
]

const sampleNames = [
  "John Smith",
  "Sarah Johnson",
  "Michael Brown",
  "Emily Davis",
  "David Wilson",
  "Jennifer Taylor",
  "Robert Anderson",
  "Lisa Thomas",
  "James Jackson",
  "Jessica White",
]

const sampleAddresses = [
  "123 Main St, Cityville",
  "456 Park Ave, Townsburg",
  "789 Oak Rd, Villageton",
  "321 Pine Blvd, Metropolis",
  "654 Maple Dr, Hamletville",
  "987 Cedar Ln, Boroughtown",
]

const sampleEmails = [
  "contact@example.com",
  "info@company.com",
  "support@business.org",
  "hello@enterprise.net",
  "office@corporation.com",
  "admin@firm.co",
]

const samplePhones = [
  "+1 (555) 123-4567",
  "+1 (555) 987-6543",
  "+1 (555) 456-7890",
  "+1 (555) 789-0123",
  "+1 (555) 234-5678",
  "+1 (555) 876-5432",
]

const sampleBanks = [
  "First National Bank",
  "Global Banking Corp",
  "City Financial",
  "United Trust Bank",
  "Premier Banking Services",
  "Secure Trust & Savings",
  "Metropolitan Bank",
]

const sampleProducts = [
  {
    name: "Dell PowerEdge R740 Server",
    description: "Refurbished, 2x Intel Xeon Gold 6248R, 128GB RAM, 8x 1.2TB SAS HDD, 2x 750W PSU",
    price: 4500,
  },
  {
    name: "HP ProLiant DL380 Gen10 Server",
    description: "New, 2x Intel Xeon Silver 4210R, 64GB RAM, 4x 1.2TB SAS HDD, 2x 800W PSU, 3-Year Warranty",
    price: 6200,
  },
  {
    name: "Cisco Catalyst 9300 Switch",
    description: "New, 24-port PoE+, Network Advantage, 1100WAC power supply",
    price: 3200,
  },
  {
    name: "Cisco Meraki MX68 Security Appliance",
    description: "New, Advanced Security License, 5-Year Enterprise License",
    price: 3800,
  },
  {
    name: "Fortinet FortiGate 100F Firewall",
    description: "New, Next-Generation Firewall with 1-Year FortiGuard UTM Protection",
    price: 5800,
  },
  {
    name: "HP EliteBook 840 G8 Laptop",
    description: 'New, Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 14" FHD Display, Windows 11 Pro',
    price: 1200,
  },
  {
    name: "Dell Latitude 5420 Laptop",
    description: 'New, Intel Core i5-1145G7, 16GB RAM, 512GB SSD, 14" FHD Display, Windows 11 Pro, 3-Year ProSupport',
    price: 1100,
  },
  {
    name: "Ubiquiti UniFi AP AC Pro",
    description: "New, Dual-Band Access Point, PoE Powered, Indoor/Outdoor Use",
    price: 149,
  },
  {
    name: "Network Installation & Configuration",
    description:
      "Professional installation and configuration of network equipment, including cabling, testing, and documentation",
    price: 2500,
  },
  {
    name: "IT Infrastructure Assessment & Planning",
    description:
      "Comprehensive assessment of current IT infrastructure, security audit, and strategic planning for future growth",
    price: 4500,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    description: 'New, Intel Core i7-1165G7, 16GB RAM, 1TB SSD, 14" 4K Display, Windows 11 Pro',
    price: 1800,
  },
  {
    name: "Microsoft Surface Laptop 4",
    description: 'New, AMD Ryzen 7, 16GB RAM, 512GB SSD, 15" Touchscreen, Windows 11 Pro',
    price: 1400,
  },
  {
    name: 'Apple MacBook Pro 16"',
    description: 'New, M1 Pro chip, 16GB RAM, 512GB SSD, 16" Retina Display, macOS Monterey',
    price: 2400,
  },
  {
    name: "Synology DS1621+ NAS",
    description: "New, 6-bay NAS, AMD Ryzen V1500B, 4GB DDR4, Expandable up to 16 bays",
    price: 900,
  },
  {
    name: "QNAP TS-h973AX NAS",
    description: "New, 9-bay NAS, AMD Ryzen V1500B, 8GB DDR4, 10GbE networking",
    price: 1200,
  },
  {
    name: "WD Red Pro 14TB NAS Hard Drive",
    description: "New, CMR Technology, 7200 RPM, 5-year warranty, Designed for NAS systems",
    price: 450,
  },
  {
    name: "Samsung 870 QVO 8TB SSD",
    description: "New, SATA III, 560MB/s read, 530MB/s write, 3-year warranty",
    price: 700,
  },
  {
    name: "APC Smart-UPS 1500VA LCD",
    description: "New, 1000W, 120V, Line Interactive, 8 outlets, Network management card",
    price: 800,
  },
  {
    name: "Tripp Lite 2200VA UPS",
    description: "New, 1920W, Smart LCD, Line Interactive, 8 outlets, USB/Serial",
    price: 650,
  },
  {
    name: "Annual IT Support Contract",
    description: "24/7 remote support, monthly on-site visits, quarterly system audits, priority response",
    price: 12000,
  },
]

export default function InvoiceEditor() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [fillItemsCount, setFillItemsCount] = useState(15)
  const [showFillDialog, setShowFillDialog] = useState(false)

  const [formData, setFormData] = useState({
    invoiceNumber: "INV-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
        description: "You must have at least one item in the invoice",
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

  // Random data generation function
  const getRandomItem = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const fillRandomData = (itemCount = 15) => {
    // Generate random client info
    const randomClient = {
      name: getRandomItem(sampleNames),
      company: getRandomItem(sampleCompanies),
      address: getRandomItem(sampleAddresses),
      phone: getRandomItem(samplePhones),
      email: getRandomItem(sampleEmails),
    }

    // Generate random bank details
    const randomBank = {
      bankName: getRandomItem(sampleBanks),
      accountTitle: "Gencore IT Solutions",
      iban:
        "PK" +
        Math.floor(Math.random() * 1000000000000000)
          .toString()
          .padStart(16, "0"),
      accountNumber: Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, "0"),
      swiftCode:
        "SWIFT" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(4, "0"),
    }

    // Generate random items
    const randomItems: InvoiceItem[] = []
    for (let i = 0; i < itemCount; i++) {
      const product = getRandomItem(sampleProducts)
      randomItems.push({
        id: `item-${i + 1}`,
        name: product.name,
        description: product.description,
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: product.price,
      })
    }

    // Update form data with random values
    setFormData({
      ...formData,
      invoiceNumber:
        "INV-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
      client: randomClient,
      items: randomItems,
      bankDetails: randomBank,
    })

    setShowFillDialog(false)

    toast({
      title: "Random Data Generated",
      description: `Generated invoice with ${itemCount} random items`,
    })
  }

  // Improved PDF generation using our utility
  const handleDownloadPDF = async () => {
    if (previewRef.current) {
      try {
        await generatePDF(previewRef.current, `Invoice_${formData.invoiceNumber}.pdf`)
        toast({
          title: "PDF Generated",
          description: "Your invoice has been downloaded successfully",
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
            <title>Print Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              @page { size: A4; margin: 15mm; }
              
              /* Add page break after 8 items */
              .page-break { page-break-after: always; }
              
              /* Hide URLs */
              a { text-decoration: none; color: inherit; }
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
    localStorage.setItem("invoice_draft", savedData)
    toast({
      title: "Draft saved",
      description: "Your invoice draft has been saved locally",
    })
  }

  const handleLoad = () => {
    const savedData = localStorage.getItem("invoice_draft")
    if (savedData) {
      setFormData(JSON.parse(savedData))
      toast({
        title: "Draft loaded",
        description: "Your saved invoice draft has been loaded",
      })
    } else {
      toast({
        title: "No saved draft",
        description: "No saved invoice draft was found",
        variant: "destructive",
      })
    }
  }

  // Determine if we need a page break based on item count
  const needsPageBreak = formData.items.length > 8

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Invoice Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-md font-medium text-[#1e40af]">Basic Information</h3>
              <Dialog open={showFillDialog} onOpenChange={setShowFillDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileSpreadsheet size={16} />
                    Fill Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Fill Random Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemCount">Number of Items</Label>
                      <Input
                        id="itemCount"
                        type="number"
                        min="1"
                        max="30"
                        value={fillItemsCount}
                        onChange={(e) => setFillItemsCount(Number.parseInt(e.target.value) || 15)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowFillDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => fillRandomData(fillItemsCount)}>Generate Data</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
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
              <h3 className="text-md font-medium text-[#1e40af] mb-2">Payment Details</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="bankDetails.bankName">Bank Name</Label>
                  <Input
                    type="text"
                    id="bankDetails.bankName"
                    name="bankDetails.bankName"
                    placeholder="Bank Name"
                    value={formData.bankDetails.bankName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bankDetails.accountTitle">Account Title</Label>
                  <Input
                    type="text"
                    id="bankDetails.accountTitle"
                    name="bankDetails.accountTitle"
                    placeholder="Account Title"
                    value={formData.bankDetails.accountTitle}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bankDetails.iban">IBAN</Label>
                  <Input
                    type="text"
                    id="bankDetails.iban"
                    name="bankDetails.iban"
                    placeholder="IBAN"
                    value={formData.bankDetails.iban}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bankDetails.accountNumber">Account Number</Label>
                  <Input
                    type="text"
                    id="bankDetails.accountNumber"
                    name="bankDetails.accountNumber"
                    placeholder="Account Number"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bankDetails.swiftCode">Swift Code</Label>
                  <Input
                    type="text"
                    id="bankDetails.swiftCode"
                    name="bankDetails.swiftCode"
                    placeholder="Swift Code"
                    value={formData.bankDetails.swiftCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                  <DialogTitle>Invoice Preview</DialogTitle>
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
                        Switches, along with comprehensive IT Solutions -- paired with smart, scalable, and secure IT
                        solutions. You name it, we deliver it.
                      </p>
                    </div>

                    {/* Invoice Title */}
                    <div className="my-4 text-center">
                      <h2 className="text-xl font-bold text-[#1e40af] uppercase">Invoice</h2>
                    </div>

                    {/* Invoice Details */}
                    <div className="flex justify-between mb-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 flex-1">
                        <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Bill To:</h3>
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
                        <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Invoice Details:</h3>
                        <div className="text-xs grid grid-cols-2 gap-1">
                          <p className="font-medium">Invoice Number:</p>
                          <p>{formData.invoiceNumber}</p>

                          <p className="font-medium">Date Issued:</p>
                          <p>
                            {formData.date
                              ? new Date(formData.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </p>

                          <p className="font-medium">Due Date:</p>
                          <p>
                            {formData.dueDate
                              ? new Date(formData.dueDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="my-4">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-2 px-3 text-left bg-[#1e40af] text-white font-semibold w-12">SR#</th>
                            <th className="py-2 px-3 text-left bg-[#1e40af] text-white font-semibold w-1/2">
                              Item Description
                            </th>
                            <th className="py-2 px-3 text-center bg-[#1e40af] text-white font-semibold w-1/6">
                              Quantity
                            </th>
                            <th className="py-2 px-3 text-right bg-[#1e40af] text-white font-semibold w-1/6">
                              Unit Price
                            </th>
                            <th className="py-2 px-3 text-right bg-[#1e40af] text-white rounded-tr-md font-semibold w-1/6">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.slice(0, needsPageBreak ? 8 : formData.items.length).map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                              <td className="py-2 px-3 text-center text-gray-700 text-xs">{index + 1}</td>
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

                    {/* Page break if needed */}
                    {needsPageBreak && <div className="page-break"></div>}

                    {/* Remaining items if page break */}
                    {needsPageBreak && (
                      <div className="my-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="py-2 px-3 text-left bg-[#1e40af] text-white font-semibold w-12">SR#</th>
                              <th className="py-2 px-3 text-left bg-[#1e40af] text-white font-semibold w-1/2">
                                Item Description
                              </th>
                              <th className="py-2 px-3 text-center bg-[#1e40af] text-white font-semibold w-1/6">
                                Quantity
                              </th>
                              <th className="py-2 px-3 text-right bg-[#1e40af] text-white font-semibold w-1/6">
                                Unit Price
                              </th>
                              <th className="py-2 px-3 text-right bg-[#1e40af] text-white rounded-tr-md font-semibold w-1/6">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.items.slice(8).map((item, index) => (
                              <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-2 px-3 text-center text-gray-700 text-xs">{index + 9}</td>
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
                    )}

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
                          <span className="text-[#1e40af]">Grand Total:</span>
                          <span className="text-[#1e40af]">{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Payment Instructions</h3>
                      <div className="text-xs grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Bank Name:</span>{" "}
                          {formData.bankDetails.bankName || "________________"}
                        </div>
                        <div>
                          <span className="font-medium">Account Title:</span>{" "}
                          {formData.bankDetails.accountTitle || "________________"}
                        </div>
                        <div>
                          <span className="font-medium">Account Number:</span>{" "}
                          {formData.bankDetails.accountNumber || "________________"}
                        </div>
                        <div>
                          <span className="font-medium">IBAN:</span> {formData.bankDetails.iban || "________________"}
                        </div>
                        <div>
                          <span className="font-medium">Swift Code:</span>{" "}
                          {formData.bankDetails.swiftCode || "________________"}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Notes</h3>
                      <p className="text-xs text-gray-600">{formData.notes}</p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-2 border-t border-gray-200 text-center">
                      <p className="text-xs text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        +92 332 0000911 | nauman@gencoreit.com | www.gencoreit.com
                      </p>
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
                  Switches, along with comprehensive IT Solutions -- paired with smart, scalable, and secure IT
                  solutions. You name it, we deliver it.
                </p>
              </div>

              {/* Invoice Title */}
              <div className="my-4 text-center">
                <h2 className="text-xl font-bold text-[#1e40af] uppercase">Invoice</h2>
              </div>

              {/* Invoice Details */}
              <div className="flex justify-between mb-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100 flex-1">
                  <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Bill To:</h3>
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
                  <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Invoice Details:</h3>
                  <div className="text-xs grid grid-cols-2 gap-1">
                    <p className="font-medium">Invoice Number:</p>
                    <p>{formData.invoiceNumber}</p>

                    <p className="font-medium">Date Issued:</p>
                    <p>
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>

                    <p className="font-medium">Due Date:</p>
                    <p>
                      {formData.dueDate
                        ? new Date(formData.dueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="my-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left bg-[#1e40af] text-white rounded-tl-md font-semibold w-12">
                        SR#
                      </th>
                      <th className="py-2 px-3 text-left bg-[#1e40af] text-white font-semibold w-1/2">
                        Item Description
                      </th>
                      <th className="py-2 px-3 text-center bg-[#1e40af] text-white font-semibold w-1/6">Quantity</th>
                      <th className="py-2 px-3 text-right bg-[#1e40af] text-white font-semibold w-1/6">Unit Price</th>
                      <th className="py-2 px-3 text-right bg-[#1e40af] text-white rounded-tr-md font-semibold w-1/6">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2 px-3 text-center text-gray-700 text-xs">{index + 1}</td>
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
                    <span className="text-[#1e40af]">Grand Total:</span>
                    <span className="text-[#1e40af]">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Payment Instructions</h3>
                <div className="text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Bank Name:</span>{" "}
                    {formData.bankDetails.bankName || "________________"}
                  </div>
                  <div>
                    <span className="font-medium">Account Title:</span>{" "}
                    {formData.bankDetails.accountTitle || "________________"}
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span>{" "}
                    {formData.bankDetails.accountNumber || "________________"}
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span> {formData.bankDetails.iban || "________________"}
                  </div>
                  <div>
                    <span className="font-medium">Swift Code:</span>{" "}
                    {formData.bankDetails.swiftCode || "________________"}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#1e40af] text-sm mb-1">Notes</h3>
                <p className="text-xs text-gray-600">{formData.notes}</p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-2 border-t border-gray-200 text-center">
                <p className="text-xs text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  +92 332 0000911 | nauman@gencoreit.com | www.gencoreit.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
