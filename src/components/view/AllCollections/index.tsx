import { commerceClient } from "@/lib/commerce";
import Image from "next/image";
import Link from "next/link";

export default async function AllCollections() {
  const collections = await commerceClient.getCollections();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full my-10">
      {collections.map((collection) => (
        <Link
          href={`/collections/${collection.handle}`}
          key={collection.id}
          className="group"
        >
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            {collection.image?.url ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-oat flex items-center justify-center">
                <span className="text-warm-brown/70 text-lg">
                  {collection.title}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors" />
            <div className="absolute bottom-4 left-4">
              <h2 className="text-xl font-display font-bold text-white">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="text-sm text-white/80 mt-1">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
