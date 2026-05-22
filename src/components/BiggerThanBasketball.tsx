import Image from "next/image";

export default function BiggerThanBasketball() {
  return (
    <section className="border-y border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src="/images/about-bench.jpg"
            alt="Coach T with players on his home court"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="label text-btc-orange mb-5">It&apos;s bigger than basketball</div>
          <h2 className="display text-5xl md:text-6xl mb-8">
            I coach hard.<br />I coach with love.
          </h2>
          <p className="text-btc-white/80 text-lg leading-relaxed">
            The court is where we start. It&apos;s not where we stop.
          </p>
          <p className="text-btc-white/80 text-lg leading-relaxed mt-4">
            I work with kids who want to get better at basketball. I also work with kids who are figuring out who they want to be. Both are the job.
          </p>
          <p className="text-btc-white/80 text-lg leading-relaxed mt-4">
            We train. We compete. We hang out. We laugh. Sometimes we cry. We grow.
          </p>
        </div>
      </div>
    </section>
  );
}
