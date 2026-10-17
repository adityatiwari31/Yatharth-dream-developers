import type { Metadata } from "next";
import EnquiryForm from "./EnquiryForm";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/Icons";
import { BRAND_LEGAL_NAME, COMPANY, INSTAGRAM_HANDLE, INSTAGRAM_URL, LINKEDIN_URL, WA_GENERAL, WHATSAPP_DISPLAY } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Register your interest in a villa at Jaipur Vatika. Message us on WhatsApp or Instagram, or leave your number and we call you back.",
};

export default function ContactPage() {
  return (
    <div className="wrap section-pad">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Register your interest</h1>
          <p className="lead mt-3">Tell us about your plot or the villa you want. We call you and explain the project, the plan and the payment schedule.</p>

          <dl className="mt-8 grid gap-4">
            <Row label="WhatsApp">
              <a href={WA_GENERAL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-medium text-brass">
                <WhatsAppIcon className="h-4 w-4" /> {WHATSAPP_DISPLAY}
              </a>
            </Row>
            <Row label="Instagram">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-medium text-brass">
                <InstagramIcon className="h-4 w-4" /> {INSTAGRAM_HANDLE}
              </a>
            </Row>
            <Row label="LinkedIn">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-medium text-brass">
                <LinkedInIcon className="h-4 w-4" /> Company page
              </a>
            </Row>
            <Row label="Upcoming project">Village Vatika, Tehsil Sanganer, Jaipur</Row>
            <Row label="Villa under construction">Khedi Gokulpura, near Ring Road, Vatika, Jaipur</Row>
            <Row label="Registered office">{COMPANY.office}</Row>
            <Row label="Company">
              {BRAND_LEGAL_NAME}
              <span className="block text-muted">CIN {COMPANY.cin}</span>
            </Row>
          </dl>
        </div>
        <div>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-line pb-3 sm:grid-cols-[180px_1fr]">
      <dt className="text-[0.85rem] text-muted">{label}</dt>
      <dd className="text-[0.95rem]">{children}</dd>
    </div>
  );
}
