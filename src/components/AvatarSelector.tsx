"use client";

import { AvatarData, AVATARS } from "@/constants/avatars";
import Image from "next/image";

interface Props {
  selectedId: string;
  onSelect: (avatar: AvatarData) => void;
}

export default function AvatarSelector({ selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-4 mt-4">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar)}
          className={`rounded-lg overflow-hidden border-2 ${
            selectedId === avatar.id
              ? "border-blue-500"
              : "border-transparent hover:border-gray-500"
          }`}
        >
          <Image
            width={64}
            height={64}
            src={avatar.img}
            alt={avatar.name}
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}
