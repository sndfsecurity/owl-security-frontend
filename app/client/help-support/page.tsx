
"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import {
  FiPhoneCall,
  FiMail,
  FiGlobe,
  FiHeadphones,
  FiClock,
  FiExternalLink,
  FiMessageCircle,
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";

export default function HelpSupportPage() {
  // Add or remove contact numbers here.
  
  const supportPhones = [
  {
    label: "Primary Contact",
    number: "+91 7378950765",
  },
  {
    label: "Alternative Contact",
    number: "+91 8010177541",
  },

  {
    label: "Additional Contact",
    number: "+91 8956159489",
  },

];

  const supportEmail = "owls.surveillance@gmail.com";
  const supportWebsite = "https://www.puneowlsecurity.in";

  const technicalIssues = [
    "Unable to log in to your account",
    "Reports are not displaying correctly",
    "Unable to view or download files",
    "Profile or account-related queries",
  ];

  return (
    <ClientLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 mt-10 md:px-7 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Page Header */}
          <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10265A] text-white">
                <FiHeadphones size={27} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
                  Client Assistance
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Help &amp; Support
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Need help with your account or reports? Our support
                  contacts are available below to assist you.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Support Information
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Contact Our Team
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the most convenient way to reach us.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {/* Emergency Contact */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FiPhoneCall size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Emergency Contact
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Contact our team directly
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <div className="flex-1 space-y-3">
                {supportPhones.map((contact) => (
                  <div
                    key={contact.label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-xs font-medium text-slate-500">
                      {contact.label}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="break-all text-sm font-semibold text-slate-800">
                        {contact.number}
                      </p>

                      <a
                        href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                        aria-label={`Call ${contact.label}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#10265A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                      >
                        <FiPhoneCall size={13} />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Support */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FiMail size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Email Support
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    For queries and technical issues
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <div className="flex-1">
                <p className="text-sm leading-6 text-slate-500">
                  Send us an email describing your issue. Include
                  relevant details so our team can understand your request.
                </p>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Support Email Address
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                    {supportEmail}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${supportEmail}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10265A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                <FiMail size={16} />
                Send Email
                <FiArrowUpRight size={15} />
              </a>
            </div>

            {/* Official Website */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <FiGlobe size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Official Website
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Learn more about OWL Security
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <div className="flex-1">
                <p className="text-sm leading-6 text-slate-500">
                  Visit our official website for company information,
                  services and other details.
                </p>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Website
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                    {supportWebsite.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>

              <a
                href={supportWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10265A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Visit Website
                <FiExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Technical Support */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FiMessageCircle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Technical Support
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  You can contact our team for assistance with the
                  following portal-related issues.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {technicalIssues.map((issue) => (
                <div
                  key={issue}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-blue-700"
                    size={18}
                  />
                  <p className="text-sm leading-5 text-slate-700">
                    {issue}
                  </p>
                </div>
              ))}
            </div>

            {/* Assistance Notice */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <FiClock
                className="mt-0.5 shrink-0 text-amber-700"
                size={20}
              />

              <div>
                <p className="text-sm font-bold text-amber-900">
                  Need further assistance?
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Contact us using one of the options above and explain
                  your issue for further assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-6 text-center">
            <p className="text-xs text-slate-400">
              OWL Security Portal
              <span className="mx-2">·</span>
              Client Help &amp; Support
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
