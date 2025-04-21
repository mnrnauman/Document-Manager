"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"
import LetterheadEditor from "@/components/letterhead-editor"
import InvoiceEditor from "@/components/invoice-editor"
import QuotationEditor from "@/components/quotation-editor"

export default function TemplateSelector() {
  const [activeTab, setActiveTab] = useState("letterhead")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsItem value="letterhead">Letterhead</TabsItem>
        <TabsItem value="invoice">Invoice</TabsItem>
        <TabsItem value="quotation">Quotation</TabsItem>
      </TabsList>
      <TabsContent value="letterhead" className="mt-4">
        <LetterheadEditor />
      </TabsContent>
      <TabsContent value="invoice" className="mt-4">
        <InvoiceEditor />
      </TabsContent>
      <TabsContent value="quotation" className="mt-4">
        <QuotationEditor />
      </TabsContent>
    </Tabs>
  )
}
