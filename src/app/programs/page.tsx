import ProgramCard from "@/components/ProgramCard";
import SeasonPlanner from "@/components/SeasonPlanner";
import { fallSeason, fallPackages, midnightMadness, privateTraining } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "Programs - BTC Ballers" };

export default function ProgramsPage() {
  const buildRegisterHref = (pkg: string) => {
    const subject = encodeURIComponent(`Fall 2026 registration - ${pkg}`);
    const body = encodeURIComponent(
      `Hi Coach T,\n\nI'd like to register for Fall 2026.\n\nPackage: ${pkg}\n\nKid's name:\nKid's age:\nWhat we want to work on:\nAnything Coach T should know:\n\nThanks.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <div className="label text-btc-orange">{fallSeason.name} &middot; {fallSeason.window}</div>
      <h1 className="display text-6xl md:text-8xl mt-3">Programs.</h1>
      <p className="mt-6 text-lg text-btc-white/80 max-w-2xl">{fallSeason.intro}</p>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {fallPackages.map((pkg) => (
          <ProgramCard
            key={pkg.id}
            label={pkg.badge ?? "Fall 2026"}
            title={pkg.label}
            price={pkg.price}
            blurb={`${pkg.sessions} sessions. Come to any session on the calendar, including Midnight Madness nights.`}
            cta={{ href: buildRegisterHref(pkg.label), text: "Register" }}
            highlight={pkg.highlight}
          >
            <div className="label mb-2">Per session</div>
            <p className="mono text-btc-orange mb-4">{pkg.perSession}</p>
            <div className="label mb-2">Payment</div>
            <ul className="space-y-2">
              {pkg.terms.map((t, i) => (
                <li key={i} className="text-sm text-btc-white/85">{t}</li>
              ))}
            </ul>
          </ProgramCard>
        ))}
      </div>

      <div className="mt-16">
        <SeasonPlanner />
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-6">
        <div className="border border-white/10 bg-btc-dim p-8">
          <div className="label text-btc-orange mb-3">Days, times & locations</div>
          <p className="text-btc-white/85 mb-6">
            Every session is on the season calendar. If it&apos;s on the calendar, you can come.
          </p>
          <ul className="space-y-4">
            {fallSeason.schedule.map((s, i) => (
              <li key={i} className="text-sm">
                <div className="font-semibold text-btc-white">{s.day}</div>
                <div className="mono text-btc-orange mt-1">{s.time}</div>
                <div className="text-btc-white/70 mt-1">{s.where}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-white/10 bg-btc-dim p-8">
          <div className="label text-btc-orange mb-3">Season details</div>
          <ul className="space-y-4 text-sm text-btc-white/85 leading-relaxed">
            <li>{fallSeason.locations}</li>
            <li>{fallSeason.noTraining}</li>
            <li>{fallSeason.weather}</li>
            <li>{fallSeason.policy}</li>
          </ul>
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="label text-btc-orange mb-2">{privateTraining.title}</div>
            <p className="text-sm text-btc-white/85 leading-relaxed">{privateTraining.blurb}</p>
            <p className="text-sm text-btc-white/70 mt-3">{privateTraining.walkIn}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 border border-white/10 bg-btc-dim p-8 md:p-10">
        <div className="label text-btc-orange mb-3">Two nights a season</div>
        <h3 className="display text-4xl mb-3">{midnightMadness.title}.</h3>
        <p className="text-btc-white/85 max-w-2xl">{midnightMadness.blurb}</p>
        <div className="mt-5 flex flex-wrap gap-6">
          <div>
            <div className="label">Nights</div>
            <ul className="mt-1 flex flex-wrap gap-2">
              {midnightMadness.nights.map((n) => (
                <li key={n} className="mono text-sm border border-white/15 px-3 py-1">{n}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label">Time</div>
            <div className="mt-1 mono text-btc-white/85">{midnightMadness.time}</div>
          </div>
        </div>
        <p className="text-btc-white/60 text-sm mt-4">{midnightMadness.note}</p>
      </div>
    </div>
  );
}
