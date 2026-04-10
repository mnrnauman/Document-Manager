"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, FileText, Receipt, FileSpreadsheet } from "lucide-react"

export default function DocNav() {
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = "gencoreAuth=; path=/; max-age=0; SameSite=Lax"
    window.location.href = "/"
  }

  const navItems = [
    { href: "/letterhead", label: "Letterhead", icon: FileText },
    { href: "/invoice", label: "Invoice", icon: Receipt },
    { href: "/quotation", label: "Quotation", icon: FileSpreadsheet },
  ]

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-[#1e40af] shadow-sm"
                  : "text-gray-600 hover:text-[#1e40af] hover:bg-white/60"
              }`}
            >
              <Icon size={15} />
              {label}
            </a>
          )
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-1 ml-4"
      >
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  )
}
