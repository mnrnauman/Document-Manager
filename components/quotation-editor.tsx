"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Download, Save, FileUp, Printer, Plus, Trash2, Eye,
  Copy, ChevronUp, ChevronDown, Building2, User, Package,
  Layers, Calendar, CreditCard, FileText, BookOpen, LayoutTemplate,
  RefreshCw, X, GripVertical, Mail,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { generatePDF } from "@/utils/pdf-generator"
import { catalogItems } from "@/lib/predefined-items"

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuotationItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  taxRate: number
}

interface ScopeItem {
  id: string
  title: string
  description: string
}

interface TimelineRow {
  id: string
  phase: string
  description: string
  duration: string
  responsible: string
}

interface PaymentMilestone {
  id: string
  percentage: number
  description: string
}

interface FormData {
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
    website: string
    ntn: string
    strn: string
    registrationNumber: string
    footerText: string
    description: string
  }
  quotationNumber: string
  revisionNumber: string
  date: string
  validUntil: string
  salesRep: string
  currency: string
  taxStatus: string
  client: {
    name: string
    company: string
    contactPerson: string
    email: string
    phone: string
    address: string
    projectName: string
    department: string
  }
  executiveSummary: string
  scopeItems: ScopeItem[]
  deliverables: ScopeItem[]
  timeline: TimelineRow[]
  items: QuotationItem[]
  paymentTerms: PaymentMilestone[]
  assumptions: string[]
  exclusions: string[]
  outOfScope: string[]
  terms: string[]
  warranty: string
  support: {
    hours: string
    responseTime: string
    escalationContact: string
  }
  acceptance: {
    customerName: string
    designation: string
    date: string
  }
  notes: string
  authorizedBy: string
}

interface QuotationTemplate {
  id: string
  name: string
  createdAt: string
  data: FormData
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FORM: FormData = {
  companyInfo: {
    name: "GENCORE",
    address: "4th Floor, Saeed Alam Tower, Liberty Market, Lahore",
    phone: "+92 332 0000911",
    email: "nauman@gencoreit.com",
    website: "www.gencoreit.com",
    ntn: "",
    strn: "",
    registrationNumber: "",
    footerText: "The Core of Digital Transformation.",
    description:
      "Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and Switches, along with comprehensive IT Solutions.",
  },
  quotationNumber: "",
  revisionNumber: "1",
  date: "",
  validUntil: "",
  salesRep: "",
  currency: "PKR",
  taxStatus: "Exclusive",
  client: { name: "", company: "", contactPerson: "", email: "", phone: "", address: "", projectName: "", department: "" },
  executiveSummary: "",
  scopeItems: [],
  deliverables: [],
  timeline: [],
  items: [{ id: "item-1", name: "", description: "", quantity: 1, unit: "Unit", unitPrice: 0, discount: 0, taxRate: 0 }],
  paymentTerms: [
    { id: "pt-1", percentage: 50, description: "Advance Payment" },
    { id: "pt-2", percentage: 30, description: "Upon Deployment Completion" },
    { id: "pt-3", percentage: 20, description: "Upon Project Sign-off" },
  ],
  assumptions: [
    "Client will provide timely access to required infrastructure.",
    "All software licenses will be provided as per the agreement.",
  ],
  exclusions: [
    "Civil works and physical infrastructure are not included.",
    "Third-party vendor management is not included unless specified.",
  ],
  outOfScope: [
    "Any item, service, feature, or deliverable not explicitly mentioned in the Scope of Work shall be considered out of scope and may require a separate quotation or change request.",
  ],
  terms: [
    "This quotation is valid for 30 days from the date of issue.",
    "Prices are exclusive of any applicable taxes unless specified.",
    "All hardware comes with manufacturer warranty as specified.",
    "Delivery timeline will be finalized upon project confirmation.",
  ],
  warranty:
    "All delivered solutions come with a 1-year warranty covering manufacturing defects. On-site support will be provided within 24 hours of issue reporting during the warranty period.",
  support: {
    hours: "Monday – Friday, 9:00 AM – 6:00 PM (PKT)",
    responseTime: "4 Business Hours (Critical) / 24 Hours (Standard)",
    escalationContact: "nauman@gencoreit.com | +92 332 0000911",
  },
  acceptance: { customerName: "", designation: "", date: "" },
  notes: "Thank you for considering GENCORE. We look forward to working with you.",
  authorizedBy: "",
}

const CURRENCIES = ["PKR", "USD", "EUR", "AED", "GBP", "SAR"]
const TAX_STATUSES = ["Exclusive", "Inclusive", "Tax-Exempt", "Zero-Rated"]
const UNITS = ["Unit", "Pcs", "Box", "License", "Month", "Year", "Hour", "Day", "Set", "Lot"]

type TabId = "company" | "customer" | "items" | "scope" | "timeline" | "payment" | "terms" | "templates"

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "company",   label: "Company",   Icon: Building2 },
  { id: "customer",  label: "Customer",  Icon: User },
  { id: "items",     label: "Items",     Icon: Package },
  { id: "scope",     label: "Scope",     Icon: Layers },
  { id: "timeline",  label: "Timeline",  Icon: Calendar },
  { id: "payment",   label: "Payment",   Icon: CreditCard },
  { id: "terms",     label: "Terms",     Icon: FileText },
  { id: "templates", label: "Templates", Icon: LayoutTemplate },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

function fmtCurrency(amount: number, currency: string) {
  const symbols: Record<string, string> = { PKR: "PKR ", USD: "$ ", EUR: "€ ", AED: "AED ", GBP: "£ ", SAR: "SAR " }
  const prefix = symbols[currency] ?? `${currency} `
  return prefix + new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount)
}

function itemLineTotal(item: QuotationItem) {
  const base = item.quantity * item.unitPrice * (1 - item.discount / 100)
  const tax = base * (item.taxRate / 100)
  return base + tax
}
function itemBase(item: QuotationItem) {
  return item.quantity * item.unitPrice * (1 - item.discount / 100)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuotationEditor() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("company")
  const [catalogValue, setCatalogValue] = useState("")
  const [templates, setTemplates] = useState<QuotationTemplate[]>([])
  const [templateName, setTemplateName] = useState("")
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM)

  // Seed quotation number + dates on mount, load templates
  useEffect(() => {
    const today = new Date()
    const exp = new Date(today); exp.setDate(exp.getDate() + 30)
    setFormData(prev => ({
      ...prev,
      quotationNumber: `QT-${today.getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: today.toISOString().split("T")[0],
      validUntil: exp.toISOString().split("T")[0],
    }))
    try {
      const saved = localStorage.getItem("quotation_templates")
      if (saved) setTemplates(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  // ── Generic field updater ──────────────────────────────────────────────────

  function set<T>(path: string, value: T) {
    const parts = path.split(".")
    setFormData(prev => {
      if (parts.length === 1) return { ...prev, [path]: value }
      if (parts.length === 2) {
        const [p, c] = parts
        return { ...prev, [p]: { ...(prev[p as keyof FormData] as Record<string, unknown>), [c]: value } }
      }
      return prev
    })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    set(e.target.name, e.target.value)
  }

  // ── Items ──────────────────────────────────────────────────────────────────

  function updateItem(id: string, field: keyof QuotationItem, value: string | number) {
    setFormData(prev => ({ ...prev, items: prev.items.map(it => it.id === id ? { ...it, [field]: value } : it) }))
  }

  function addItem() {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: uid(), name: "", description: "", quantity: 1, unit: "Unit", unitPrice: 0, discount: 0, taxRate: 0 }],
    }))
  }

  function removeItem(id: string) {
    if (formData.items.length <= 1) { toast({ title: "Cannot remove", description: "At least one item required", variant: "destructive" }); return }
    setFormData(prev => ({ ...prev, items: prev.items.filter(it => it.id !== id) }))
  }

  function moveItem(id: string, dir: -1 | 1) {
    setFormData(prev => {
      const arr = [...prev.items]
      const i = arr.findIndex(it => it.id === id)
      const j = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, items: arr }
    })
  }

  function addFromCatalog(idx: string) {
    const i = parseInt(idx, 10)
    if (isNaN(i) || i < 0) return
    const p = catalogItems[i]
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: uid(), name: p.name, description: p.description, quantity: 1, unit: "Unit", unitPrice: p.price, discount: 0, taxRate: 0 }],
    }))
    setCatalogValue("")
    toast({ title: "Item added", description: `${p.name} added to quotation` })
  }

  // ── Scope / Deliverables ───────────────────────────────────────────────────

  function addScopeItem(key: "scopeItems" | "deliverables") {
    setFormData(prev => ({ ...prev, [key]: [...prev[key], { id: uid(), title: "", description: "" }] }))
  }

  function updateScopeItem(key: "scopeItems" | "deliverables", id: string, field: "title" | "description", value: string) {
    setFormData(prev => ({ ...prev, [key]: prev[key].map(it => it.id === id ? { ...it, [field]: value } : it) }))
  }

  function removeScopeItem(key: "scopeItems" | "deliverables", id: string) {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter(it => it.id !== id) }))
  }

  function moveScopeItem(key: "scopeItems" | "deliverables", id: string, dir: -1 | 1) {
    setFormData(prev => {
      const arr = [...prev[key]]
      const i = arr.findIndex(it => it.id === id)
      const j = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, [key]: arr }
    })
  }

  function duplicateScopeItem(key: "scopeItems" | "deliverables", id: string) {
    setFormData(prev => {
      const idx = prev[key].findIndex(it => it.id === id)
      if (idx === -1) return prev
      const copy = { ...prev[key][idx], id: uid() }
      const arr = [...prev[key]]
      arr.splice(idx + 1, 0, copy)
      return { ...prev, [key]: arr }
    })
  }

  // ── Timeline ───────────────────────────────────────────────────────────────

  function addTimelineRow() {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { id: uid(), phase: "", description: "", duration: "", responsible: "" }],
    }))
  }

  function updateTimeline(id: string, field: keyof TimelineRow, value: string) {
    setFormData(prev => ({ ...prev, timeline: prev.timeline.map(r => r.id === id ? { ...r, [field]: value } : r) }))
  }

  function removeTimelineRow(id: string) {
    setFormData(prev => ({ ...prev, timeline: prev.timeline.filter(r => r.id !== id) }))
  }

  function moveTimeline(id: string, dir: -1 | 1) {
    setFormData(prev => {
      const arr = [...prev.timeline]
      const i = arr.findIndex(r => r.id === id)
      const j = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, timeline: arr }
    })
  }

  // ── Payment Terms ──────────────────────────────────────────────────────────

  function addPaymentTerm() {
    setFormData(prev => ({ ...prev, paymentTerms: [...prev.paymentTerms, { id: uid(), percentage: 0, description: "" }] }))
  }

  function updatePaymentTerm(id: string, field: keyof PaymentMilestone, value: string | number) {
    setFormData(prev => ({ ...prev, paymentTerms: prev.paymentTerms.map(pt => pt.id === id ? { ...pt, [field]: value } : pt) }))
  }

  function removePaymentTerm(id: string) {
    setFormData(prev => ({ ...prev, paymentTerms: prev.paymentTerms.filter(pt => pt.id !== id) }))
  }

  function movePaymentTerm(id: string, dir: -1 | 1) {
    setFormData(prev => {
      const arr = [...prev.paymentTerms]
      const i = arr.findIndex(pt => pt.id === id)
      const j = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, paymentTerms: arr }
    })
  }

  // ── String arrays (terms, assumptions, exclusions, outOfScope) ────────────

  function addStrItem(key: "terms" | "assumptions" | "exclusions" | "outOfScope") {
    setFormData(prev => ({ ...prev, [key]: [...prev[key], ""] }))
  }

  function updateStrItem(key: "terms" | "assumptions" | "exclusions" | "outOfScope", index: number, value: string) {
    setFormData(prev => { const arr = [...prev[key]]; arr[index] = value; return { ...prev, [key]: arr } })
  }

  function removeStrItem(key: "terms" | "assumptions" | "exclusions" | "outOfScope", index: number) {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }))
  }

  // ── Totals ─────────────────────────────────────────────────────────────────

  const subtotal = formData.items.reduce((s, it) => s + itemBase(it), 0)
  const totalTax = formData.items.reduce((s, it) => s + itemBase(it) * (it.taxRate / 100), 0)
  const grandTotal = subtotal + totalTax

  // ── Email ──────────────────────────────────────────────────────────────────

  async function handleSendEmail() {
    if (!emailTo.trim()) { toast({ title: "Enter recipient email", variant: "destructive" }); return }
    setEmailSending(true)
    try {
      const res = await fetch("/api/send-quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo.trim(),
          subject: emailSubject.trim() || undefined,
          message: emailMessage.trim() || undefined,
          formData,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to send")
      toast({ title: "Email sent!", description: `Quotation sent to ${emailTo}` })
      setEmailOpen(false)
      setEmailTo("")
      setEmailSubject("")
      setEmailMessage("")
    } catch (err: any) {
      toast({ title: "Send failed", description: err.message, variant: "destructive" })
    } finally {
      setEmailSending(false)
    }
  }

  // ── PDF / Print ────────────────────────────────────────────────────────────

  async function handleDownloadPDF() {
    const el = previewRef.current || printRef.current
    if (!el) return
    try {
      await generatePDF(el, `Quotation_${formData.quotationNumber}.pdf`)
      toast({ title: "PDF Generated", description: "Quotation downloaded successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" })
    }
  }

  function handlePrint() {
    if (!printRef.current) return
    const content = printRef.current.innerHTML
    const w = window.open("", "_blank")
    if (!w) return
    const styles = Array.from(document.querySelectorAll("style,link[rel='stylesheet']")).map(el => el.outerHTML).join("")
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Quotation</title>${styles}<style>@media print{@page{size:A4;margin:10mm;}body{margin:0;background:#fff;}}</style></head><body style="background:#fff">${content}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 1200)
  }

  // ── Draft ──────────────────────────────────────────────────────────────────

  function handleSave() {
    localStorage.setItem("quotation_draft", JSON.stringify(formData))
    toast({ title: "Draft saved", description: "Quotation saved locally" })
  }

  function handleLoad() {
    try {
      const raw = localStorage.getItem("quotation_draft")
      if (!raw) { toast({ title: "No draft", description: "No saved draft found", variant: "destructive" }); return }
      setFormData(mergeWithDefaults(JSON.parse(raw)))
      toast({ title: "Draft loaded" })
    } catch {
      localStorage.removeItem("quotation_draft")
      toast({ title: "Load failed", description: "Draft was corrupted", variant: "destructive" })
    }
  }

  // ── Templates ──────────────────────────────────────────────────────────────

  function saveTemplate() {
    const name = templateName.trim()
    if (!name) { toast({ title: "Enter a template name", variant: "destructive" }); return }
    const tpl: QuotationTemplate = { id: uid(), name, createdAt: new Date().toLocaleDateString(), data: formData }
    const updated = [...templates, tpl]
    setTemplates(updated)
    localStorage.setItem("quotation_templates", JSON.stringify(updated))
    setTemplateName("")
    toast({ title: "Template saved", description: `"${name}" saved` })
  }

  function mergeWithDefaults(data: Partial<FormData>): FormData {
    return {
      ...DEFAULT_FORM,
      ...data,
      companyInfo: { ...DEFAULT_FORM.companyInfo, ...(data.companyInfo ?? {}) },
      client: { ...DEFAULT_FORM.client, ...(data.client ?? {}) },
      support: { ...DEFAULT_FORM.support, ...(data.support ?? {}) },
      acceptance: { ...DEFAULT_FORM.acceptance, ...(data.acceptance ?? {}) },
      scopeItems: data.scopeItems ?? DEFAULT_FORM.scopeItems,
      deliverables: data.deliverables ?? DEFAULT_FORM.deliverables,
      timeline: data.timeline ?? DEFAULT_FORM.timeline,
      items: data.items ?? DEFAULT_FORM.items,
      paymentTerms: data.paymentTerms ?? DEFAULT_FORM.paymentTerms,
      assumptions: data.assumptions ?? DEFAULT_FORM.assumptions,
      exclusions: data.exclusions ?? DEFAULT_FORM.exclusions,
      outOfScope: data.outOfScope ?? DEFAULT_FORM.outOfScope,
      terms: data.terms ?? DEFAULT_FORM.terms,
    }
  }

  function loadTemplate(tpl: QuotationTemplate) {
    setFormData(mergeWithDefaults(tpl.data))
    toast({ title: "Template loaded", description: `"${tpl.name}" loaded` })
  }

  function duplicateTemplate(tpl: QuotationTemplate) {
    const copy: QuotationTemplate = { ...tpl, id: uid(), name: `${tpl.name} (Copy)`, createdAt: new Date().toLocaleDateString() }
    const updated = [...templates, copy]
    setTemplates(updated)
    localStorage.setItem("quotation_templates", JSON.stringify(updated))
    toast({ title: "Template duplicated" })
  }

  function deleteTemplate(id: string) {
    const updated = templates.filter(t => t.id !== id)
    setTemplates(updated)
    localStorage.setItem("quotation_templates", JSON.stringify(updated))
    toast({ title: "Template deleted" })
  }

  // ─── Preview Content ───────────────────────────────────────────────────────

  const PreviewContent = ({ forPDF = false }: { forPDF?: boolean }) => {
    const fmt = (n: number) => fmtCurrency(n, formData.currency)
    const sm = forPDF ? "text-[9px]" : "text-xs"
    const base = forPDF ? "text-[10px]" : "text-sm"
    const h3cls = `font-bold text-[#1e40af] uppercase tracking-wide border-b border-[#1e40af] pb-0.5 mb-1 ${forPDF ? "text-[10px]" : "text-xs"}`

    return (
      <div className={forPDF ? "bg-white" : "w-full p-4"} style={forPDF ? { padding: "18px 24px", fontSize: "11px", color: "#1f2937" } : { color: "#1f2937" }}>

        {/* ── Header ── */}
        <div className={`flex justify-between items-start border-b-2 border-[#1e40af] ${forPDF ? "pb-2 mb-2" : "pb-4 mb-4"}`}>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="GENCORE Logo" width={forPDF ? 44 : 60} height={forPDF ? 44 : 60} className="object-contain" />
            <div>
              <h1 className={`font-extrabold text-[#1e40af] ${forPDF ? "text-lg" : "text-2xl"}`}>{formData.companyInfo.name}</h1>
              <p className="text-[#f97316] font-medium" style={{ fontSize: forPDF ? "9px" : "11px" }}>The Core of Digital Transformation.</p>
            </div>
          </div>
          <div className="text-right text-gray-500" style={{ fontSize: forPDF ? "9px" : "11px" }}>
            <p>{formData.companyInfo.address}</p>
            <p>{formData.companyInfo.phone}</p>
            <p>{formData.companyInfo.email}</p>
            {formData.companyInfo.website && <p>{formData.companyInfo.website}</p>}
            {formData.companyInfo.ntn && <p>NTN: {formData.companyInfo.ntn}</p>}
            {formData.companyInfo.strn && <p>STRN: {formData.companyInfo.strn}</p>}
          </div>
        </div>

        {/* ── Document Title ── */}
        <div className={`text-center ${forPDF ? "mb-2" : "mb-4"}`}>
          <h2 className={`font-extrabold text-[#1e40af] tracking-widest uppercase ${forPDF ? "text-base" : "text-xl"}`}>Quotation</h2>
        </div>

        {/* ── Quotation Details + Client ── */}
        <div className={`grid grid-cols-2 gap-3 ${forPDF ? "mb-2" : "mb-4"}`}>
          <div className="bg-blue-50 border border-blue-100 rounded p-2">
            <p className={`font-bold text-[#1e40af] mb-1 ${forPDF ? "text-[9px]" : "text-xs"}`}>QUOTATION DETAILS</p>
            <table className="w-full" style={{ fontSize: forPDF ? "9px" : "11px" }}>
              <tbody>
                {[
                  ["Quotation No:", formData.quotationNumber],
                  ["Revision:", `Rev ${formData.revisionNumber}`],
                  ["Issue Date:", formData.date ? new Date(formData.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""],
                  ["Expiry Date:", formData.validUntil ? new Date(formData.validUntil).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""],
                  ["Sales Rep:", formData.salesRep],
                  ["Currency:", formData.currency],
                  ["Tax Status:", formData.taxStatus],
                ].map(([k, v]) => v ? (
                  <tr key={k}>
                    <td className="font-semibold text-gray-600 pr-2 whitespace-nowrap">{k}</td>
                    <td className="text-gray-800">{v}</td>
                  </tr>
                ) : null)}
              </tbody>
            </table>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded p-2">
            <p className={`font-bold text-[#f97316] mb-1 ${forPDF ? "text-[9px]" : "text-xs"}`}>CUSTOMER INFORMATION</p>
            <div style={{ fontSize: forPDF ? "9px" : "11px" }} className="space-y-0.5">
              {formData.client.company && <p><span className="font-semibold">Company:</span> {formData.client.company}</p>}
              {formData.client.name && <p><span className="font-semibold">Client:</span> {formData.client.name}</p>}
              {formData.client.contactPerson && <p><span className="font-semibold">Contact:</span> {formData.client.contactPerson}</p>}
              {formData.client.department && <p><span className="font-semibold">Dept:</span> {formData.client.department}</p>}
              {formData.client.projectName && <p><span className="font-semibold">Project:</span> {formData.client.projectName}</p>}
              {formData.client.email && <p><span className="font-semibold">Email:</span> {formData.client.email}</p>}
              {formData.client.phone && <p><span className="font-semibold">Phone:</span> {formData.client.phone}</p>}
              {formData.client.address && <p><span className="font-semibold">Address:</span> {formData.client.address}</p>}
            </div>
          </div>
        </div>

        {/* ── Executive Summary ── */}
        {formData.executiveSummary && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Executive Summary</p>
            <p className={`text-gray-700 leading-relaxed ${sm}`}>{formData.executiveSummary}</p>
          </div>
        )}

        {/* ── Scope of Work ── */}
        {formData.scopeItems.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Scope of Work</p>
            <div className="space-y-1">
              {formData.scopeItems.map((s, i) => (
                <div key={s.id} className="flex gap-2">
                  <span className={`text-gray-500 shrink-0 ${sm}`}>{i + 1}.</span>
                  <div>
                    <p className={`font-medium text-gray-800 ${sm}`}>{s.title}</p>
                    {s.description && <p className={`text-gray-600 ${sm}`}>{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Deliverables ── */}
        {formData.deliverables.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Deliverables</p>
            <div className="space-y-1">
              {formData.deliverables.map((d, i) => (
                <div key={d.id} className="flex gap-2">
                  <span className={`text-gray-500 shrink-0 ${sm}`}>{i + 1}.</span>
                  <div>
                    <p className={`font-medium text-gray-800 ${sm}`}>{d.title}</p>
                    {d.description && <p className={`text-gray-600 ${sm}`}>{d.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Project Timeline ── */}
        {formData.timeline.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Project Timeline</p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1e40af] text-white">
                  {["Phase", "Description", "Duration", "Responsible"].map(h => (
                    <th key={h} className={`text-left px-2 py-1 ${sm}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.timeline.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className={`px-2 py-1 font-medium text-gray-800 ${sm}`}>{r.phase}</td>
                    <td className={`px-2 py-1 text-gray-600 ${sm}`}>{r.description}</td>
                    <td className={`px-2 py-1 text-gray-600 ${sm}`}>{r.duration}</td>
                    <td className={`px-2 py-1 text-gray-600 ${sm}`}>{r.responsible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pricing Table ── */}
        <div className={forPDF ? "mb-2" : "mb-4"}>
          <p className={h3cls}>Pricing</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f97316] text-white">
                {["#", "Item", "Qty", "Unit", "Unit Price", "Disc %", "Tax %", "Total"].map(h => (
                  <th key={h} className={`text-left px-1.5 py-1 ${sm} ${h === "Item" ? "w-2/5" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, i) => (
                <tr key={item.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className={`px-1.5 py-1 text-gray-500 ${sm}`}>{i + 1}</td>
                  <td className={`px-1.5 py-1 ${sm}`}>
                    <p className="font-medium text-gray-800">{item.name || "—"}</p>
                    {item.description && <p className="text-gray-500" style={{ fontSize: forPDF ? "8px" : "10px" }}>{item.description}</p>}
                  </td>
                  <td className={`px-1.5 py-1 text-gray-700 ${sm}`}>{item.quantity}</td>
                  <td className={`px-1.5 py-1 text-gray-700 ${sm}`}>{item.unit}</td>
                  <td className={`px-1.5 py-1 text-gray-700 ${sm}`}>{fmt(item.unitPrice)}</td>
                  <td className={`px-1.5 py-1 text-gray-700 ${sm}`}>{item.discount > 0 ? `${item.discount}%` : "—"}</td>
                  <td className={`px-1.5 py-1 text-gray-700 ${sm}`}>{item.taxRate > 0 ? `${item.taxRate}%` : "—"}</td>
                  <td className={`px-1.5 py-1 font-semibold text-gray-800 ${sm}`}>{fmt(itemLineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totals */}
          <div className="flex justify-end mt-1">
            <div className={`border border-gray-200 rounded ${forPDF ? "w-48 p-1" : "w-56 p-2"}`}>
              <div className={`flex justify-between border-b border-gray-100 ${forPDF ? "py-0.5" : "py-1"} ${sm}`}>
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              <div className={`flex justify-between border-b border-gray-100 ${forPDF ? "py-0.5" : "py-1"} ${sm}`}>
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{fmt(totalTax)}</span>
              </div>
              <div className={`flex justify-between font-bold text-[#f97316] ${forPDF ? "py-0.5" : "py-1"} ${base}`}>
                <span>Grand Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment Terms ── */}
        {formData.paymentTerms.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Payment Terms</p>
            <div className="flex flex-wrap gap-2">
              {formData.paymentTerms.map((pt, i) => (
                <div key={pt.id} className={`flex-1 min-w-[100px] bg-blue-50 border border-blue-100 rounded text-center ${forPDF ? "p-1" : "p-2"}`}>
                  <p className={`font-extrabold text-[#1e40af] ${forPDF ? "text-sm" : "text-base"}`}>{pt.percentage}%</p>
                  <p className={`text-gray-600 ${sm}`}>{pt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Assumptions ── */}
        {formData.assumptions.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Assumptions</p>
            <ul className={`list-disc pl-4 text-gray-700 space-y-0.5 ${sm}`}>
              {formData.assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {/* ── Exclusions ── */}
        {formData.exclusions.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Exclusions</p>
            <ul className={`list-disc pl-4 text-gray-700 space-y-0.5 ${sm}`}>
              {formData.exclusions.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {/* ── Out of Scope ── */}
        {formData.outOfScope.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Out of Scope</p>
            <ul className={`list-disc pl-4 text-gray-700 space-y-0.5 ${sm}`}>
              {formData.outOfScope.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        )}

        {/* ── Terms & Conditions ── */}
        {formData.terms.length > 0 && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Terms &amp; Conditions</p>
            <ol className={`list-decimal pl-4 text-gray-700 space-y-0.5 ${sm}`}>
              {formData.terms.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </div>
        )}

        {/* ── Warranty ── */}
        {formData.warranty && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Warranty</p>
            <p className={`text-gray-700 ${sm}`}>{formData.warranty}</p>
          </div>
        )}

        {/* ── Support ── */}
        {(formData.support.hours || formData.support.responseTime || formData.support.escalationContact) && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Support</p>
            <div className={`grid grid-cols-3 gap-2 ${sm}`}>
              {formData.support.hours && (
                <div className="bg-gray-50 border border-gray-100 rounded p-2">
                  <p className="font-semibold text-[#1e40af] mb-0.5">Support Hours</p>
                  <p className="text-gray-600">{formData.support.hours}</p>
                </div>
              )}
              {formData.support.responseTime && (
                <div className="bg-gray-50 border border-gray-100 rounded p-2">
                  <p className="font-semibold text-[#1e40af] mb-0.5">Response Time</p>
                  <p className="text-gray-600">{formData.support.responseTime}</p>
                </div>
              )}
              {formData.support.escalationContact && (
                <div className="bg-gray-50 border border-gray-100 rounded p-2">
                  <p className="font-semibold text-[#1e40af] mb-0.5">Escalation Contact</p>
                  <p className="text-gray-600">{formData.support.escalationContact}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        {formData.notes && (
          <div className={forPDF ? "mb-2" : "mb-4"}>
            <p className={h3cls}>Notes</p>
            <p className={`text-gray-700 italic ${sm}`}>{formData.notes}</p>
          </div>
        )}

        {/* ── Acceptance Clause ── */}
        <div className={forPDF ? "mb-2 mt-3" : "mb-4 mt-6"}>
          <p className={h3cls}>Acceptance</p>
          <p className={`text-gray-700 ${sm}`}>
            By signing below, the Customer acknowledges that they have reviewed and accepted the scope, pricing, payment terms, and conditions outlined in this quotation.
          </p>
        </div>

        {/* ── Signatures ── */}
        <div className={`grid grid-cols-2 gap-6 ${forPDF ? "mt-3 mb-2" : "mt-4 mb-4"}`}>
          <div>
            <p className={`font-semibold text-gray-700 mb-1 ${sm}`}>Authorized by ({formData.companyInfo.name}):</p>
            <div className="border-b border-gray-400 h-6 mb-1" />
            <p className={`text-gray-500 ${sm}`}>{formData.authorizedBy || "Name & Signature"}</p>
          </div>
          <div>
            <p className={`font-semibold text-gray-700 mb-1 ${sm}`}>Accepted by (Customer):</p>
            <div className="border-b border-gray-400 h-6 mb-1" />
            <p className={`text-gray-500 ${sm}`}>
              {formData.acceptance.customerName || "Customer Name"}{formData.acceptance.designation ? ` — ${formData.acceptance.designation}` : ""}
            </p>
            {formData.acceptance.date && <p className={`text-gray-400 ${sm}`}>Date: {formData.acceptance.date}</p>}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t-2 border-[#1e40af] pt-2 text-center">
          <p className={`font-bold text-[#1e40af] ${sm}`}>{formData.companyInfo.footerText || "The Core of Digital Transformation."}</p>
          <p className={`text-gray-500 mt-0.5 ${sm}`}>
            {[formData.companyInfo.phone, formData.companyInfo.email, formData.companyInfo.website].filter(Boolean).join(" | ")}
          </p>
          {formData.companyInfo.ntn && <p className={`text-gray-400 ${sm}`}>NTN: {formData.companyInfo.ntn}{formData.companyInfo.strn ? ` | STRN: ${formData.companyInfo.strn}` : ""}</p>}
        </div>
      </div>
    )
  }

  // ─── Tab Content Renderers ────────────────────────────────────────────────

  const field = (label: string, name: string, type = "text", placeholder = "") => (
    <div key={name}>
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Input type={type} name={name} value={(name.includes(".") ? (formData as any)[name.split(".")[0]]?.[name.split(".")[1]] : (formData as any)[name]) ?? ""} onChange={handleChange} placeholder={placeholder} className="h-8 text-sm mt-0.5" />
    </div>
  )

  const tabContent: Record<TabId, React.ReactNode> = {

    // ── Company ──
    company: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Company Information</p>
        {field("Company Name", "companyInfo.name", "text", "GENCORE")}
        {field("Address", "companyInfo.address")}
        {field("Phone", "companyInfo.phone", "tel")}
        {field("Email", "companyInfo.email", "email")}
        {field("Website", "companyInfo.website")}
        {field("NTN", "companyInfo.ntn", "text", "National Tax Number")}
        {field("STRN", "companyInfo.strn", "text", "Sales Tax Registration Number")}
        {field("Company Registration No.", "companyInfo.registrationNumber")}
        <div>
          <Label className="text-xs font-medium text-gray-600">Business Description</Label>
          <Textarea name="companyInfo.description" value={formData.companyInfo.description} onChange={handleChange} rows={3} className="text-sm mt-0.5 resize-none" />
        </div>
        {field("Footer Text", "companyInfo.footerText", "text", "The Core of Digital Transformation.")}
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Quotation Header</p>
          {field("Quotation Number", "quotationNumber")}
          {field("Revision Number", "revisionNumber", "text", "1")}
          {field("Issue Date", "date", "date")}
          {field("Expiry Date", "validUntil", "date")}
          {field("Sales Representative", "salesRep")}
          <div>
            <Label className="text-xs font-medium text-gray-600">Currency</Label>
            <select name="currency" value={formData.currency} onChange={handleChange} className="w-full h-8 px-2 mt-0.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#1e40af] focus:outline-none">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Tax Status</Label>
            <select name="taxStatus" value={formData.taxStatus} onChange={handleChange} className="w-full h-8 px-2 mt-0.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#1e40af] focus:outline-none">
              {TAX_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {field("Authorized By", "authorizedBy", "text", "Name & Designation")}
        </div>
      </div>
    ),

    // ── Customer ──
    customer: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Customer Information</p>
        {field("Customer Name", "client.name")}
        {field("Company Name", "client.company")}
        {field("Contact Person", "client.contactPerson")}
        {field("Email", "client.email", "email")}
        {field("Phone", "client.phone", "tel")}
        {field("Address", "client.address")}
        {field("Project Name", "client.projectName")}
        {field("Department", "client.department")}
        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-2">Executive Summary</p>
          <Textarea
            name="executiveSummary"
            value={formData.executiveSummary}
            onChange={handleChange}
            rows={5}
            placeholder="Provide a high-level overview of the proposed solution..."
            className="text-sm resize-none"
          />
        </div>
      </div>
    ),

    // ── Items ──
    items: (
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-medium text-gray-600">Quick Add from Catalog</Label>
          <select value={catalogValue} onChange={e => { setCatalogValue(e.target.value); if (e.target.value) addFromCatalog(e.target.value) }} className="w-full h-8 px-2 mt-0.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#1e40af] focus:outline-none">
            <option value="">— Select a product —</option>
            {catalogItems.map((it, i) => <option key={i} value={i}>{it.name} — {fmtCurrency(it.price, formData.currency)}</option>)}
          </select>
        </div>
        <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
          {formData.items.map((item, index) => (
            <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#1e40af]">Item #{index + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveItem(item.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={12} /></button>
                  <button onClick={() => moveItem(item.id, 1)} disabled={index === formData.items.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={12} /></button>
                  <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-red-100"><Trash2 size={12} className="text-red-500" /></button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Item Name</Label>
                <Input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} placeholder="Product / Service Name" className="h-7 text-sm mt-0.5" />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} rows={2} className="resize-none text-sm mt-0.5" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, "quantity", Number(e.target.value))} min={1} className="h-7 text-sm mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs">Unit</Label>
                  <select value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)} className="w-full h-7 px-2 mt-0.5 text-sm border border-gray-300 rounded-md bg-white">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Unit Price</Label>
                  <Input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))} min={0} step={0.01} className="h-7 text-sm mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs">Discount (%)</Label>
                  <Input type="number" value={item.discount} onChange={e => updateItem(item.id, "discount", Number(e.target.value))} min={0} max={100} className="h-7 text-sm mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs">Tax Rate (%)</Label>
                  <Input type="number" value={item.taxRate} onChange={e => updateItem(item.id, "taxRate", Number(e.target.value))} min={0} max={100} className="h-7 text-sm mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Line Total</Label>
                  <div className="h-7 flex items-center px-2 mt-0.5 bg-white border border-gray-200 rounded text-sm font-semibold text-[#1e40af]">
                    {fmtCurrency(itemLineTotal(item), formData.currency)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addItem} className="w-full flex items-center gap-2 h-8 text-sm border-dashed">
          <Plus size={14} /> Add Item Manually
        </Button>
        <div className="bg-blue-50 border border-blue-100 rounded p-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmtCurrency(subtotal, formData.currency)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Total Tax</span><span>{fmtCurrency(totalTax, formData.currency)}</span></div>
          <div className="flex justify-between font-bold text-[#f97316]"><span>Grand Total</span><span>{fmtCurrency(grandTotal, formData.currency)}</span></div>
        </div>
      </div>
    ),

    // ── Scope ──
    scope: (
      <div className="space-y-4">
        {(["scopeItems", "deliverables"] as const).map(key => (
          <div key={key}>
            <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-2">
              {key === "scopeItems" ? "Scope of Work" : "Deliverables"}
            </p>
            <div className="space-y-2">
              {formData[key].map((item, index) => (
                <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveScopeItem(key, item.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={12} /></button>
                      <button onClick={() => moveScopeItem(key, item.id, 1)} disabled={index === formData[key].length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={12} /></button>
                      <button onClick={() => duplicateScopeItem(key, item.id)} className="p-1 rounded hover:bg-blue-100"><Copy size={12} className="text-blue-500" /></button>
                      <button onClick={() => removeScopeItem(key, item.id)} className="p-1 rounded hover:bg-red-100"><Trash2 size={12} className="text-red-500" /></button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input value={item.title} onChange={e => updateScopeItem(key, item.id, "title", e.target.value)} placeholder="Section title..." className="h-7 text-sm mt-0.5" />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea value={item.description} onChange={e => updateScopeItem(key, item.id, "description", e.target.value)} rows={2} className="resize-none text-sm mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => addScopeItem(key)} className="w-full mt-2 flex items-center gap-2 h-8 text-sm border-dashed">
              <Plus size={14} /> Add {key === "scopeItems" ? "Scope Item" : "Deliverable"}
            </Button>
          </div>
        ))}
      </div>
    ),

    // ── Timeline ──
    timeline: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Project Timeline</p>
        <div className="space-y-3">
          {formData.timeline.map((row, index) => (
            <div key={row.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">Phase #{index + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveTimeline(row.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={12} /></button>
                  <button onClick={() => moveTimeline(row.id, 1)} disabled={index === formData.timeline.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={12} /></button>
                  <button onClick={() => removeTimelineRow(row.id)} className="p-1 rounded hover:bg-red-100"><Trash2 size={12} className="text-red-500" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Phase</Label>
                  <Input value={row.phase} onChange={e => updateTimeline(row.id, "phase", e.target.value)} placeholder="e.g. Phase 1" className="h-7 text-sm mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs">Duration</Label>
                  <Input value={row.duration} onChange={e => updateTimeline(row.id, "duration", e.target.value)} placeholder="e.g. 2 Weeks" className="h-7 text-sm mt-0.5" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input value={row.description} onChange={e => updateTimeline(row.id, "description", e.target.value)} placeholder="Phase description..." className="h-7 text-sm mt-0.5" />
              </div>
              <div>
                <Label className="text-xs">Responsible Party</Label>
                <Input value={row.responsible} onChange={e => updateTimeline(row.id, "responsible", e.target.value)} placeholder="e.g. GENCORE Team" className="h-7 text-sm mt-0.5" />
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addTimelineRow} className="w-full flex items-center gap-2 h-8 text-sm border-dashed">
          <Plus size={14} /> Add Phase
        </Button>
      </div>
    ),

    // ── Payment ──
    payment: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Payment Milestones</p>
        <div className="space-y-2">
          {formData.paymentTerms.map((pt, index) => (
            <div key={pt.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">Milestone #{index + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => movePaymentTerm(pt.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={12} /></button>
                  <button onClick={() => movePaymentTerm(pt.id, 1)} disabled={index === formData.paymentTerms.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={12} /></button>
                  <button onClick={() => removePaymentTerm(pt.id)} className="p-1 rounded hover:bg-red-100"><Trash2 size={12} className="text-red-500" /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <Label className="text-xs">Percentage (%)</Label>
                  <Input type="number" value={pt.percentage} onChange={e => updatePaymentTerm(pt.id, "percentage", Number(e.target.value))} min={0} max={100} className="h-7 text-sm mt-0.5" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Input value={pt.description} onChange={e => updatePaymentTerm(pt.id, "description", e.target.value)} placeholder="e.g. Advance Payment" className="h-7 text-sm mt-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addPaymentTerm} className="w-full flex items-center gap-2 h-8 text-sm border-dashed">
          <Plus size={14} /> Add Milestone
        </Button>
        {formData.paymentTerms.length > 0 && (
          <div className="text-xs text-gray-500 text-center">
            Total: {formData.paymentTerms.reduce((s, pt) => s + pt.percentage, 0)}%
            {formData.paymentTerms.reduce((s, pt) => s + pt.percentage, 0) !== 100 && (
              <span className="text-amber-500 ml-1">(should equal 100%)</span>
            )}
          </div>
        )}
      </div>
    ),

    // ── Terms ──
    terms: (
      <div className="space-y-4">
        {(["assumptions", "exclusions", "outOfScope", "terms"] as const).map(key => (
          <div key={key}>
            <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-2">
              {key === "terms" ? "Terms & Conditions" : key === "outOfScope" ? "Out of Scope" : key.charAt(0).toUpperCase() + key.slice(1)}
            </p>
            <div className="space-y-2">
              {formData[key].map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Textarea
                    value={item}
                    onChange={e => updateStrItem(key, index, e.target.value)}
                    rows={2}
                    className="resize-none text-sm flex-1"
                  />
                  <button onClick={() => removeStrItem(key, index)} className="mt-1 p-1 rounded hover:bg-red-100 shrink-0"><Trash2 size={13} className="text-red-500" /></button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => addStrItem(key)} className="w-full mt-2 flex items-center gap-2 h-8 text-sm border-dashed">
              <Plus size={14} /> Add {key === "terms" ? "Term" : key === "outOfScope" ? "Out of Scope Item" : key.slice(0, -1).charAt(0).toUpperCase() + key.slice(0, -1).slice(1)}
            </Button>
          </div>
        ))}

        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Warranty</p>
          <Textarea name="warranty" value={formData.warranty} onChange={handleChange} rows={3} className="resize-none text-sm" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Support</p>
          {field("Support Hours", "support.hours", "text", "Monday – Friday, 9 AM – 6 PM")}
          {field("Response Time", "support.responseTime", "text", "4 Hours Critical / 24 Hours Standard")}
          {field("Escalation Contact", "support.escalationContact")}
        </div>

        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Acceptance</p>
          {field("Customer Name", "acceptance.customerName")}
          {field("Designation", "acceptance.designation")}
          {field("Acceptance Date", "acceptance.date", "date")}
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-1">Notes</p>
          <Textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="resize-none text-sm" />
        </div>
      </div>
    ),

    // ── Templates ──
    templates: (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Save as Template</p>
          <div className="flex gap-2">
            <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name..." className="h-8 text-sm flex-1" />
            <Button onClick={saveTemplate} className="h-8 text-sm bg-[#1e40af] hover:bg-[#1e3a8a]">
              <Save size={14} className="mr-1" /> Save
            </Button>
          </div>
        </div>
        {templates.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No templates saved yet.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide">Saved Templates</p>
            {templates.map(tpl => (
              <div key={tpl.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tpl.name}</p>
                    <p className="text-xs text-gray-400">{tpl.createdAt}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => loadTemplate(tpl)}>
                      <FileUp size={11} className="mr-1" /> Load
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => duplicateTemplate(tpl)}>
                      <Copy size={11} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:bg-red-50" onClick={() => deleteTemplate(tpl.id)}>
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border-t pt-3">
          <Button variant="outline" className="w-full h-8 text-sm" onClick={() => { setFormData(DEFAULT_FORM); toast({ title: "Reset to defaults" }) }}>
            <RefreshCw size={13} className="mr-2" /> Reset to Defaults
          </Button>
        </div>
      </div>
    ),
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* ── Left: Tabbed Form ── */}
      <div className="lg:col-span-2 space-y-3">

        {/* Tab Nav */}
        <div className="bg-white border border-gray-200 rounded-lg p-1.5 grid grid-cols-4 gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === id
                  ? "bg-[#1e40af] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {tabContent[activeTab]}
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-2">
          <Button onClick={handleSave} size="sm" className="flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1e3a8a] h-8 text-xs">
            <Save size={13} /> Save Draft
          </Button>
          <Button onClick={handleLoad} size="sm" variant="outline" className="flex items-center gap-1.5 h-8 text-xs">
            <FileUp size={13} /> Load Draft
          </Button>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1.5 h-8 text-xs">
                <Eye size={13} /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quotation Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-2" ref={previewRef}>
                <PreviewContent forPDF />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>Close</Button>
                <Button size="sm" onClick={handleDownloadPDF} className="flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1e3a8a]">
                  <Download size={13} /> Download PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleDownloadPDF} size="sm" className="flex items-center gap-1.5 bg-[#f97316] hover:bg-[#ea6c0a] h-8 text-xs">
            <Download size={13} /> PDF
          </Button>
          <Button onClick={handlePrint} size="sm" variant="outline" className="flex items-center gap-1.5 h-8 text-xs">
            <Printer size={13} /> Print
          </Button>

          {/* ── Email Dialog ── */}
          <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 h-8 text-xs">
                <Mail size={13} /> Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail size={16} className="text-green-600" /> Send Quotation by Email
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Recipient Email *</Label>
                  <Input
                    type="email"
                    placeholder="client@example.com"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject (optional)</Label>
                  <Input
                    placeholder={`Quotation${formData.quotationNumber ? ` ${formData.quotationNumber}` : ""} from GENCORE`}
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Personal Message (optional)</Label>
                  <Textarea
                    placeholder="Add a personal note to the email..."
                    value={emailMessage}
                    onChange={e => setEmailMessage(e.target.value)}
                    rows={3}
                    className="resize-none text-sm mt-1"
                  />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800">
                  📧 Sent from <strong>noreply@gencoreit.com</strong> — includes full pricing, scope &amp; payment terms. A contact note with <strong>info@gencoreit.com</strong> and <strong>0332 0000911</strong> is automatically added.
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => setEmailOpen(false)} disabled={emailSending}>Cancel</Button>
                  <Button
                    size="sm"
                    onClick={handleSendEmail}
                    disabled={emailSending || !emailTo.trim()}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1.5"
                  >
                    {emailSending ? (
                      <><RefreshCw size={13} className="animate-spin" /> Sending…</>
                    ) : (
                      <><Mail size={13} /> Send Email</>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Right: Live Preview ── */}
      <div className="lg:col-span-3">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400 ml-2">Live Preview</span>
          </div>
          <div ref={printRef} className="overflow-auto max-h-[85vh]">
            <PreviewContent />
          </div>
        </div>
      </div>
    </div>
  )
}
