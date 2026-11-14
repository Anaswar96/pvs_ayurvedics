import React from "react";
import Link from "next/link";
import { Announcement } from "@/lib/types";

interface AnnouncementBarProps {
  announcements?: Announcement[];
}

export default function AnnouncementBar({ announcements }: AnnouncementBarProps) {
  if (!announcements || announcements.length === 0) return null;

  const activeAnnouncement = announcements.find((a) => a.is_active);
  if (!activeAnnouncement) return null;

  const content = (
    <div
      className="text-xs md:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 transition-colors duration-200"
      style={{
        backgroundColor: activeAnnouncement.bg_color || "#0d3b27",
        color: activeAnnouncement.text_color || "#ffffff",
      }}
    >
      <span>{activeAnnouncement.text}</span>
      {activeAnnouncement.link_url && (
        <span className="underline underline-offset-4 text-emerald-200 text-xs hover:text-white transition-colors">
          Learn More &rarr;
        </span>
      )}
    </div>
  );

  if (activeAnnouncement.link_url) {
    return (
      <Link href={activeAnnouncement.link_url} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
