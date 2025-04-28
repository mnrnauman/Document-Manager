"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"
import LetterheadEditor from "@/components/letterhead-editor"
import InvoiceEditor from "@/components/invoice-editor"
import QuotationEditor from "@/components/quotation-editor"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TemplateSelector() {
  const [activeTab, setActiveTab] = useState("letterhead")

  const handleLogout = () => {
    sessionStorage.removeItem("gencoreAuth")
    window.location.reload()
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsItem value="letterhead">Letterhead</TabsItem>
            <TabsItem value="invoice">Invoice</TabsItem>
            <TabsItem value="quotation">Quotation</TabsItem>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={handleLogout} className="ml-4 flex items-center gap-1">
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      <TabsContent value="letterhead" className="mt-4">
        <LetterheadEditor />
      </TabsContent>
      <TabsContent value="invoice" className="mt-4">
        <InvoiceEditor />
      </TabsContent>
      <TabsContent value="quotation" className="mt-4">
        <QuotationEditor />
      </TabsContent>
    </div>
  )
}
