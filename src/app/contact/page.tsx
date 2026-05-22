import { site } from "@/lib/siteConfig";

export const metadata = { title: "Contact - BTC Ballers" };

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-20">
      <div className="label text-btc-orange">Get in touch</div>
      <h1 className="display text-6xl md:text-8xl mt-3">Contact.</h1>

      <div className="mt-12 border border-white/10 bg-btc-dim p-8 md:p-12">
        <div className="label mb-3">Email</div>
        <a
          href={`mailto:${site.email}`}
          className="display text-3xl md:text-4xl text-btc-orange hover:text-btc-white transition break-words"
        >
          {site.email}
        </a>

        <div className="mt-10 space-y-4 text-btc-white/85 leading-relaxed">
          <p>
            Email me. I read everything that comes in. I respond when I can - usually within a day or two.
          </p>
          <p>
            When you write, tell me your kid&apos;s name, their age, and what you want them to get out of this. The more I know up front, the more useful I can be.
          </p>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm">
        <div className="border border-white/10 p-5">
          <div className="label text-btc-orange mb-2">Summer Camp</div>
          <p className="text-btc-white/80">Tell me which week and how old your kid is.</p>
        </div>
        <div className="border border-white/10 p-5">
          <div className="label text-btc-orange mb-2">Summer Training</div>
          <p className="text-btc-white/80">Tell me proposed dates and what they want to work on.</p>
        </div>
        <div className="border border-white/10 p-5">
          <div className="label text-btc-orange mb-2">Open Gym</div>
          <p className="text-btc-white/80">Just show up. Free. Bring friends.</p>
        </div>
      </div>
    </div>
  );
}
