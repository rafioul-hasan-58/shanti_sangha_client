"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK_AVATAR = "/images/admin/avatar-placeholder.svg";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
}

/** Displays user's profile photo or falls back to the club default avatar placeholder. */
export default function UserAvatar({
  src,
  name,
  className = "h-10 w-10",
}: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const trimmedSrc = typeof src === "string" ? src.trim() : "";
  const hasValidPicture =
    Boolean(trimmedSrc) &&
    trimmedSrc !== "null" &&
    trimmedSrc !== "undefined" &&
    !imgFailed;

  const avatarSrc = hasValidPicture ? trimmedSrc : FALLBACK_AVATAR;

  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={avatarSrc}
        alt={name?.trim() || "Profile"}
        fill
        unoptimized
        className="object-cover"
        onError={() => {
          if (avatarSrc !== FALLBACK_AVATAR) {
            setImgFailed(true);
          }
        }}
      />
    </div>
  );
}
