import DocNav from "@/components/doc-nav"
import QuotationEditor from "@/components/quotation-editor"

export default function QuotationPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e40af] mb-1">
            Gencore IT Solutions
          </h1>
          <p className="text-gray-500 text-sm">Document Generator</p>
        </div>
        <DocNav />
        <QuotationEditor />
      </div>
    </main>
  )
}
