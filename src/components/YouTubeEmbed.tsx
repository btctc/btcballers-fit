"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeEmbed({ videoId, title }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="aspect-video w-full overflow-hidden border border-white/10 bg-btc-dim">
      {isPlaying ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative h-full w-full overflow-hidden text-left"
          aria-label={`Play ${title}`}
        >
          <img src={thumbnail} alt="" className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100" />
          <span className="absolute inset-0 bg-gradient-to-t from-btc-black/70 via-btc-black/12 to-transparent" aria-hidden="true" />
          <span className="absolute left-5 bottom-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center bg-btc-orange text-btc-black transition group-hover:bg-btc-white" aria-hidden="true">
              <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-current" />
            </span>
            <span className="font-semibold text-btc-white">Play training video</span>
          </span>
        </button>
      )}
    </div>
  );
}
