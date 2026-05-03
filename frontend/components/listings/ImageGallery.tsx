"use client";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const visible = images.slice(0, 5);

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
      {visible.map((image, index) => (
        <div
          key={image}
          className={`overflow-hidden rounded-[28px] ${index === 0 ? "md:row-span-2" : ""}`}
        >
          <img
            src={image}
            alt={`${title} ${index + 1}`}
            className="h-60 w-full object-cover transition duration-500 hover:scale-105 sm:h-64 md:h-full"
          />
        </div>
      ))}
    </div>
  );
}
