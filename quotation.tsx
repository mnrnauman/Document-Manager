import Image from "next/image"

export default function Quotation() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const validUntilDate = new Date()
  validUntilDate.setDate(validUntilDate.getDate() + 30)
  const formattedValidUntil = validUntilDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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

        {/* Quotation Title */}
        <div className="mt-8 mb-6 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#f97316] rounded-md blur-sm opacity-20"></div>
          <h2 className="relative text-2xl font-bold text-center text-[#1e40af] uppercase bg-white py-2 border border-gray-100 rounded-md shadow-sm">
            Quotation
          </h2>
        </div>

        {/* Quotation Details */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
          <div className="mb-4 md:mb-0 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm flex-1">
            <h3 className="font-semibold text-[#1e40af] mb-3 border-b pb-1">Client Information:</h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="text-gray-700 font-medium w-24">Client Name:</span>
                <span className="text-gray-700 border-b border-gray-300 flex-1">________________</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium w-24">Company:</span>
                <span className="text-gray-700 border-b border-gray-300 flex-1">________________</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium w-24">Address:</span>
                <span className="text-gray-700 border-b border-gray-300 flex-1">________________</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium w-24">Phone:</span>
                <span className="text-gray-700 border-b border-gray-300 flex-1">________________</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium w-24">Email:</span>
                <span className="text-gray-700 border-b border-gray-300 flex-1">________________</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm md:w-1/3">
            <h3 className="font-semibold text-[#1e40af] mb-3 border-b pb-1">Quotation Details:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-700 font-medium">Quotation Number:</p>
              <p className="text-gray-700">QT-2023-001</p>

              <p className="text-gray-700 font-medium">Date:</p>
              <p className="text-gray-700">{currentDate}</p>

              <p className="text-gray-700 font-medium">Valid Until:</p>
              <p className="text-gray-700">{formattedValidUntil}</p>
            </div>
          </div>
        </div>

        {/* Quotation Items */}
        <div className="mt-8 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left bg-[#f97316] text-white rounded-tl-lg font-semibold w-1/2">
                    Item Description
                  </th>
                  <th className="py-3 px-4 text-center bg-[#f97316] text-white font-semibold w-1/6">Quantity</th>
                  <th className="py-3 px-4 text-right bg-[#f97316] text-white font-semibold w-1/6">Unit Price</th>
                  <th className="py-3 px-4 text-right bg-[#f97316] text-white rounded-tr-lg font-semibold w-1/6">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    <div>
                      <p className="font-medium">HPE ProLiant DL380 Gen10 Server</p>
                      <p className="text-sm text-gray-500">
                        New, 2x Intel Xeon Silver 4210R, 64GB RAM, 4x 1.2TB SAS HDD, 2x 800W PSU, 3-Year Warranty
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">2</td>
                  <td className="py-3 px-4 text-right text-gray-700">$6,200.00</td>
                  <td className="py-3 px-4 text-right text-gray-700">$12,400.00</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    <div>
                      <p className="font-medium">Cisco Meraki MX68 Security Appliance</p>
                      <p className="text-sm text-gray-500">New, Advanced Security License, 5-Year Enterprise License</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">1</td>
                  <td className="py-3 px-4 text-right text-gray-700">$3,800.00</td>
                  <td className="py-3 px-4 text-right text-gray-700">$3,800.00</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    <div>
                      <p className="font-medium">Dell Latitude 5420 Laptop</p>
                      <p className="text-sm text-gray-500">
                        New, Intel Core i5-1145G7, 16GB RAM, 512GB SSD, 14" FHD Display, Windows 11 Pro, 3-Year
                        ProSupport
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">10</td>
                  <td className="py-3 px-4 text-right text-gray-700">$1,100.00</td>
                  <td className="py-3 px-4 text-right text-gray-700">$11,000.00</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    <div>
                      <p className="font-medium">Ubiquiti UniFi AP AC Pro</p>
                      <p className="text-sm text-gray-500">
                        New, Dual-Band Access Point, PoE Powered, Indoor/Outdoor Use
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">8</td>
                  <td className="py-3 px-4 text-right text-gray-700">$149.00</td>
                  <td className="py-3 px-4 text-right text-gray-700">$1,192.00</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    <div>
                      <p className="font-medium">IT Infrastructure Assessment & Planning</p>
                      <p className="text-sm text-gray-500">
                        Comprehensive assessment of current IT infrastructure, security audit, and strategic planning
                        for future growth
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">1</td>
                  <td className="py-3 px-4 text-right text-gray-700">$4,500.00</td>
                  <td className="py-3 px-4 text-right text-gray-700">$4,500.00</td>
                </tr>
                {/* Empty rows for additional items */}
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-400 italic">Additional item...</td>
                    <td className="py-3 px-4 text-center text-gray-400"></td>
                    <td className="py-3 px-4 text-right text-gray-400"></td>
                    <td className="py-3 px-4 text-right text-gray-400"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Subtotal:</span>
              <span className="text-gray-700">$32,892.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Tax (16%):</span>
              <span className="text-gray-700">$5,262.72</span>
            </div>
            <div className="flex justify-between py-3 font-bold">
              <span className="text-[#f97316]">Grand Total:</span>
              <span className="text-[#f97316]">$38,154.72</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm mb-8">
          <h3 className="font-semibold text-[#1e40af] mb-3 border-b pb-1">Terms and Conditions</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>This quotation is valid for 30 days from the date of issue.</li>
            <li>50% advance payment is required to initiate the project.</li>
            <li>Prices are subject to change if requirements are modified.</li>
            <li>Delivery timeline will be finalized upon project confirmation.</li>
            <li>Payment terms: Remaining 50% upon project completion.</li>
            <li>All hardware comes with manufacturer warranty as specified.</li>
            <li>Installation and configuration services are included unless otherwise specified.</li>
            <li>Prices are exclusive of any applicable taxes unless specified.</li>
          </ul>
        </div>

        {/* Notes */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-[#1e40af] mb-2 border-b pb-1">Notes</h3>
          <p className="text-gray-600 text-sm">
            Thank you for considering Gencore IT Solutions. We look forward to working with you. Please feel free to
            contact us if you have any questions regarding this quotation or if you require any customizations to better
            suit your needs.
          </p>
        </div>

        {/* Acceptance */}
        <div className="mb-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-1">Authorized by (Gencore IT Solutions):</p>
              <div className="border-b border-gray-300 h-8 mb-1"></div>
              <p className="text-gray-500 text-sm">Name & Signature</p>
            </div>
            <div>
              <p className="text-gray-700 mb-1">Accepted by (Client):</p>
              <div className="border-b border-gray-300 h-8 mb-1"></div>
              <p className="text-gray-500 text-sm">Name, Signature & Date</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-12">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#f97316]"></div>
          <div className="border-t border-gray-200 pt-4 pb-6 text-center">
            <p className="text-sm text-[#1e40af] font-medium">Next Generation Core IT Solutions</p>
            <p className="text-xs text-gray-500 mt-1">www.Gencoreit.com | +92 332 0000911 | nauman@gencoreit.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
