"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();
  
  // Không render ChatWidget trong admin area
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <ChatWidget />;
}
