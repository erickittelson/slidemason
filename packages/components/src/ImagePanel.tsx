export interface ImagePanelProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function ImagePanel({ src, alt, caption, className = '' }: ImagePanelProps) {
  return (
    <figure className={`${className}`.trim() || undefined}>
      <img
        src={src}
        alt={alt}
        className="w-full rounded-[var(--sm-radius)] object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--sm-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
