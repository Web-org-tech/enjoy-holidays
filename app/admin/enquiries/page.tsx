import { getAllEnquiriesAdmin } from "@/lib/supabase/queries";
import { deleteEnquiryAction } from "@/app/actions/enquiries";
import { MessageCircle, Phone, Calendar, User, Package as PackageIcon, Sparkles } from "lucide-react";
import EnquiryStatusSelect from "@/components/admin/EnquiryStatusSelect";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiriesAdmin();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full text-[#111827] space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1">
            Customer Enquiries
          </h1>
          <p className="text-[#4B5563] text-sm">
            {enquiries.length} customer {enquiries.length === 1 ? "booking" : "bookings"} and enquiry requests
          </p>
        </div>
      </div>

      {/* Helpful Hint banner */}
      <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center shrink-0 text-[#059669]">
          <Sparkles size={16} />
        </div>
        <p className="text-xs sm:text-sm font-medium">
          Tap the &ldquo;Call&rdquo; or &ldquo;WhatsApp&rdquo; buttons to initiate quick contact with interested travellers directly.
        </p>
      </div>

      {/* MOBILE VIEW: Touch-friendly cards */}
      <div className="block md:hidden space-y-4">
        {enquiries.map((enq: any) => (
          <div
            key={enq.id}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                  <User size={16} className="text-[#059669]" />
                  <span>{enq.name}</span>
                </h3>
                <div className="text-xs text-[#6B7280] font-medium mt-1 flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>
                    {new Date(enq.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <EnquiryStatusSelect enquiryId={enq.id} initialStatus={enq.status} />
              </div>
            </div>

            {enq.package?.name && (
              <div className="flex items-center gap-1.5 text-xs text-[#374151] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5E7EB]">
                <PackageIcon size={14} className="text-[#059669] shrink-0" />
                <span className="font-medium truncate">Package: {enq.package.name}</span>
              </div>
            )}

            {enq.message && (
              <p className="text-xs text-[#4B5563] bg-[#F8FAFC] p-3 rounded-xl border border-[#E5E7EB] italic">
                &ldquo;{enq.message}&rdquo;
              </p>
            )}

            {/* Quick 1-tap call & WhatsApp buttons */}
            <div className="pt-2 border-t border-[#E5E7EB] flex items-center gap-2">
              <a
                href={`tel:${enq.phone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                id={`call-enq-${enq.id}`}
              >
                <Phone size={14} />
                <span>Call</span>
              </a>

              {enq.phone && enq.phone !== "0000000000" && (
                <a
                  href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  id={`wa-enq-${enq.id}`}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              )}

              <div className="shrink-0">
                <ConfirmDeleteButton
                  itemType="Enquiry"
                  title="Delete enquiry"
                  onConfirm={async () => {
                    "use server";
                    await deleteEnquiryAction(enq.id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[700px] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Direct Contact
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Tour Package
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Source
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {enquiries.map((enq: any) => (
                <tr
                  key={enq.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#111827] text-sm">{enq.name}</div>
                    {enq.message && (
                      <div className="text-[#6B7280] text-xs mt-0.5 max-w-[220px] truncate">
                        {enq.message}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${enq.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-xs font-semibold transition-colors"
                      >
                        <Phone size={12} />
                        <span>{enq.phone}</span>
                      </a>
                      {enq.phone && enq.phone !== "0000000000" && (
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 text-[#15803D] hover:bg-[#25D366]/20 border border-[#86EFAC] text-xs font-semibold transition-colors"
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#374151] text-xs font-medium">
                      {enq.package?.name ?? "General Inquiry"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[#4B5563] text-xs font-medium capitalize bg-[#F1F5F9] px-2.5 py-0.5 rounded-md border border-[#E5E7EB]">
                      {enq.source?.replace("_", " ") ?? "form"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <EnquiryStatusSelect enquiryId={enq.id} initialStatus={enq.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#6B7280] text-xs font-medium">
                      {new Date(enq.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ConfirmDeleteButton
                      itemType="Enquiry"
                      title="Delete enquiry"
                      onConfirm={async () => {
                        "use server";
                        await deleteEnquiryAction(enq.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {enquiries.length === 0 && (
          <div className="text-center py-16 text-[#6B7280] text-sm">
            No customer enquiries recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
