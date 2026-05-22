import { campWeeks } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

export default function CampWeekList() {
  return (
    <ul className="divide-y divide-white/5 border-y border-white/10">
      {campWeeks.map((w) => {
        const isOpen = w.spotsLeft > 0;
        const subject = encodeURIComponent(`Camp reservation - ${w.dates}`);
        const body = encodeURIComponent(
          `Hi Coach T,\n\nI'd like to reserve a spot for the week of ${w.dates}.\n\nKid's name:\nKid's age:\nNotes:\n\nThanks.`
        );
        const href = `mailto:${site.email}?subject=${subject}&body=${body}`;

        return (
          <li key={w.id} className="py-5 flex items-center justify-between gap-4">
            <div>
              <div className="mono text-base text-btc-white">{w.dates}</div>
              <div className="label mt-1">
                {isOpen ? `${w.spotsLeft} of ${w.spotsTotal} spots open` : "Full"}
              </div>
            </div>
            {isOpen ? (
              <a
                href={href}
                className="border border-btc-orange text-btc-orange px-4 py-2 text-sm font-semibold hover:bg-btc-orange hover:text-btc-black transition"
              >
                Reserve
              </a>
            ) : (
              <span className="label text-btc-mute">Closed</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
