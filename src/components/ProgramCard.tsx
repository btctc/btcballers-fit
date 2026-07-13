import Image from "next/image";

type Props = {
  label: string;
  title: string;
  price: string;
  blurb: string;
  image?: { src: string; alt: string; compact?: boolean };
  children?: React.ReactNode;
  cta?: { href: string; text: string } | null;
  highlight?: boolean;
};

export default function ProgramCard({ label, title, price, blurb, image, children, cta, highlight }: Props) {
  return (
    <article className={`border bg-btc-dim p-8 flex flex-col h-full ${highlight ? "border-btc-orange" : "border-white/10"}`}>
      {image && (
        <div className={`relative mb-7 w-full overflow-hidden bg-btc-black ${image.compact ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      )}
      <div className="label text-btc-orange">{label}</div>
      <h3 className="display text-4xl md:text-5xl mt-3">{title}</h3>
      <div className="mono text-btc-orange mt-3 text-lg">{price}</div>
      <p className="text-btc-white/85 mt-5 leading-relaxed">{blurb}</p>
      <div className="mt-7 flex-1">{children}</div>
      {cta && (
        <a
          href={cta.href}
          className="mt-8 inline-block bg-btc-orange text-btc-black px-5 py-3 font-semibold text-center hover:bg-btc-white transition"
        >
          {cta.text}
        </a>
      )}
    </article>
  );
}
