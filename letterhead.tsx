import Image from "next/image"

export default function Letterhead() {
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden print:shadow-none print:border-0">
      <div className="p-8 max-w-[800px] mx-auto">
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
            Providing New and Used IT Equipment including Servers, Laptops, Systems, Firewalls, Routers, and Switches,
            along with comprehensive IT Solutions.
          </p>
        </div>

        {/* Date and Recipient */}
        <div className="mt-8">
          <div className="mb-6">
            <p className="text-gray-700 flex items-center">
              <span className="w-16 font-medium">Date:</span>
              <span className="text-gray-500 border-b border-gray-300 flex-1">________________</span>
            </p>
          </div>
          <div className="mb-8">
            <p className="text-gray-700 font-medium mb-2">To:</p>
            <div className="pl-4 border-l-2 border-[#f97316]">
              <p className="text-gray-500 border-b border-gray-300 mb-2">________________</p>
              <p className="text-gray-500 border-b border-gray-300 mb-2">________________</p>
              <p className="text-gray-500 border-b border-gray-300">________________</p>
            </div>
          </div>
        </div>

        {/* Subject Line */}
        <div className="mb-6">
          <p className="text-gray-700 flex items-center">
            <span className="w-16 font-medium">Subject:</span>
            <span className="text-gray-500 border-b border-gray-300 flex-1">________________</span>
          </p>
        </div>

        {/* Letter Body */}
        <div className="min-h-[400px] border-b border-gray-200 pb-6">
          <p className="text-gray-400 italic">Letter content goes here...</p>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <div className="mb-8">
            <p className="text-gray-700">Sincerely,</p>
            <div className="mt-8 mb-1 border-b border-gray-300 w-48"></div>
            <p className="text-gray-700 font-medium">Gencore IT Solutions</p>
          </div>

          <div className="relative mt-12">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#f97316]"></div>
            <div className="border-t border-gray-200 pt-4 pb-6 text-center">
              <p className="text-sm text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
              <p className="text-xs text-gray-500 mt-1">www.Gencoreit.com | +92 332 0000911 | nauman@gencoreit.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
