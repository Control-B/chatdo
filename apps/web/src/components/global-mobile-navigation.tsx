"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import MobileNavigation from "./mobile-navigation";

// Maps route path to MobileNavigation tab id
function tabFromPath(pathname: string): string {
  if (!pathname || pathname === "/") return "home";
  if (pathname.startsWith("/channels") || pathname.startsWith("/home"))
    return "home";
  if (pathname.startsWith("/direct-messages") || pathname.startsWith("/dms"))
    return "dms";
  if (pathname.startsWith("/documents")) return "files";
  if (pathname.startsWith("/activity")) return "activity";
  return "home";
}

export default function GlobalMobileNavigation() {
  const pathname = usePathname();
  const computed = useMemo(() => tabFromPath(pathname || "/"), [pathname]);
  const [active, setActive] = useState(computed);

  useEffect(() => {
    setActive(computed);
  }, [computed]);

  return <MobileNavigation activeTab={active} onTabChange={setActive} />;
}
