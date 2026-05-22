import { openGym } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

type Props = {
  className?: string;
};

export default function OpenGymSignupButton({ className = "" }: Props) {
  const subject = encodeURIComponent("Open Gym registration");
  const body = encodeURIComponent(
    `Hi Coach T,\n\nI'd like to register for Open Gym.\n\nPlayer name:\nPlayer age:\nParent/guardian name:\nEmail:\nPhone:\nWhich date(s): ${openGym.dates.join(", ")}\nNotes:\n\nThanks.`
  );
  const href = `mailto:${site.email}?subject=${subject}&body=${body}`;

  return (
    <a
      href={href}
      className={`inline-block bg-btc-orange px-5 py-3 text-center font-semibold text-btc-black hover:bg-btc-white transition ${className}`}
    >
      Register for Open Gym
    </a>
  );
}
