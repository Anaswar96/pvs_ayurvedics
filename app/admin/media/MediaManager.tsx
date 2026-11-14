"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Copy, Check, Trash2, Images, ExternalLink, Loader2 } from "lucide-react";
import { MediaAsset } from "@/lib/types";

interface MediaManagerProps {
  initialAssets?: MediaAsset[];
}

export default function MediaManager({ initialAssets = [] }: MediaManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(
    initialAssets.length > 0
      ? initialAssets
      : [
          {
            id: "m-1",
            cloudinary_id: "pvs-ayurvedics/hero",
            secure_url: "/images/hero-ayurvedic.svg",
            file_name: "hero-ayurvedic.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
          {
            id: "m-2",
            cloudinary_id: "pvs-ayurvedics/products/hair-oil",
            secure_url: "/images/products/herbal-hair-oil.svg",
            file_name: "herbal-hair-oil.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
          {
            id: "m-3",
            cloudinary_id: "pvs-ayurvedics/products/immunity",
            secure_url: "/images/products/immunity-care.svg",
            file_name: "immunity-care.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
          {
            id: "m-4",
            cloudinary_id: "pvs-ayurvedics/banners/promo",
            secure_url: "/images/banners/promo-banner.svg",
            file_name: "promo-banner.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
          {
            id: "m-5",
            cloudinary_id: "pvs-ayurvedics/kerala-heritage",
            secure_url: "/images/kerala-heritage.svg",
            file_name: "kerala-heritage.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
          {
            id: "m-6",
            cloudinary_id: "pvs-ayurvedics/manjeri-map",
            secure_url: "/images/manjeri-map.svg",
            file_name: "manjeri-map.svg",
            format: "svg",
            created_at: new Date().toISOString(),
          },
        ]
  );

  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "pvs-ayurvedics/gallery");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const result = await res.json();
        if (result.url) {
          const newAsset: MediaAsset = {
            id: `media_${Date.now()}_${i}`,
            cloudinary_id: result.public_id || `upload_${Date.now()}`,
            secure_url: result.url,
            file_name: file.name,
            format: result.format || file.type.split("/")[1],
            created_at: new Date().toISOString(),
          };
          setAssets((prev) => [newAsset, ...prev]);
        }
      } catch {
        alert(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media asset from library?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Media &amp; Cloudinary Library
          </h2>
          <p className="text-xs text-stone-500">
            Upload and optimize Ayurvedic product photos, banners, and clinic gallery assets.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors shadow-sm cursor-pointer self-start sm:self-auto">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading to Cloud...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload New Photos</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
          >
            <div className="relative w-full aspect-square bg-stone-50 border-b border-stone-100 flex items-center justify-center p-2">
              <Image
                src={asset.secure_url}
                alt={asset.file_name}
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="p-3 space-y-2 text-xs">
              <p className="font-bold text-stone-800 text-[11px] truncate" title={asset.file_name}>
                {asset.file_name}
              </p>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset.secure_url, asset.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:text-[#0d3b27]"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
