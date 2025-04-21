import TemplateSelector from "@/components/template-selector"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e40af] mb-2">
            Gencore IT Solutions - Document Generator
          </h1>
          <p className="text-gray-600">Create, edit, and download professional business documents</p>
        </div>

        <TemplateSelector />
      </div>
    </main>
  )
}
