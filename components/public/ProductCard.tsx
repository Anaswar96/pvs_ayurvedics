import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { getProductWhatsAppLink } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({
  product,
  whatsappNumber = "+919061853542",
}: ProductCardProps) {
  const whatsappUrl = getProductWhatsAppLink(
    whatsappNumber,
    product.name,
    product.sku
  );

  return (
    <div className="ayur-card group flex flex-col justify-between overflow-hidden p-4 sm:p-5 h-full relative">
      {/* Product Image Container */}
      <div>
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-50/80 mb-4 border border-stone-100 flex items-center justify-center">
            <Image
              src={product.main_image || "/images/products/herbal-hair-oil.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
            />
          </div>
        </Link>

        {/* Category Tag */}
        {product.category && (
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            {product.category.name}
          </span>
        )}

        {/* Product Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#0d3b27] font-serif-ayur group-hover:text-[#165b33] transition-colors leading-snug line-clamp-1">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
          {product.short_description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3b27] hover:text-[#165b33] group/btn transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-emerald-700 hover:bg-emerald-50 transition-colors"
          title={`Inquire about ${product.name} on WhatsApp`}
          aria-label={`Inquire about ${product.name} on WhatsApp`}
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600/10" />
        </a>
      </div>
    </div>
  );
}
