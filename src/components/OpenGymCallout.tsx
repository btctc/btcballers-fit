import { openGym } from "@/lib/programs";

export default function OpenGymCallout() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <div className="border border-white/10 bg-btc-dim p-8 md:p-12 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="label text-btc-orange mb-3">Free this summer</div>
          <h3 className="display text-4xl md:text-5xl">Open Gym</h3>
          <div className="mono text-btc-orange mt-3 text-lg">{openGym.price}</div>
        </div>
        <div className="md:col-span-2">
          <p className="text-btc-white/85 text-lg leading-relaxed">{openGym.blurb}</p>
          <div className="mt-5 label">When</div>
          <p className="mt-2 text-btc-white/85">{openGym.time}</p>
          <div className="mt-5 label">Dates</div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {openGym.dates.map((d) => (
              <li key={d} className="mono text-sm border border-white/15 px-3 py-1">{d}</li>
            ))}
          </ul>
          <p className="text-btc-white/60 text-sm mt-5">{openGym.note}</p>
        </div>
      </div>
    </section>
  );
}
