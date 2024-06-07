"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@nearbyy/ui";

interface AnnouncementsProps {
  children?: React.ReactNode;
}

const announcements = [
  {
    key: "nearbyy_announcement_2",
    component: () => (
      <div className="flex min-w-[400px] max-w-[600px] flex-col items-center space-y-2">
        <h1 className="w-full text-left text-2xl font-semibold">
          New: Add websites as files
        </h1>
        <p>
          You can now add websites as files in your project. Just paste the URL
          and we&apos;ll take care of the rest!
        </p>
        <div className="py-4">
          <iframe
            className="overflow-hidden rounded-md"
            width="580"
            height="330"
            src="https://www.youtube.com/embed/MGALQu1acoU?autoplay=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    ),
  },
];

const lastAnnouncement = announcements[announcements.length - 1]!;

const Announcements: React.FC<AnnouncementsProps> = () => {
  const [loading, setLoading] = useState(true);
  const [hasSeenAnnouncement, setHasSeenAnnouncement] = useState(false);

  useEffect(() => {
    const localStorageKey = lastAnnouncement.key;
    const hasSeen = localStorage.getItem(localStorageKey);
    if (hasSeen) {
      setHasSeenAnnouncement(true);
    }
    setLoading(false);
  }, []);

  const handleAnnouncementSeen = () => {
    const localStorageKey = lastAnnouncement.key;
    localStorage.setItem(localStorageKey, "true");
    setHasSeenAnnouncement(true);
  };

  if (loading || hasSeenAnnouncement) {
    return null; // Don't render anything if it is loading or if the user has already seen the announcement
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-5 flex flex-col space-y-4 rounded-md bg-white p-8">
        <lastAnnouncement.component />
        <Button onClick={handleAnnouncementSeen}>
          Got it! Thanks for letting me know.
        </Button>
      </div>
    </div>
  );
};

export default Announcements;
