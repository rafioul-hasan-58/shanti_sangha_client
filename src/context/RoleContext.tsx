"use client";
/** Holds the active role (member or admin). One account can use both. */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ViewRole } from "@/types";

type RoleCtx = { role: ViewRole; setRole: (r: ViewRole) => void };
const RoleContext = createContext<RoleCtx>({ role: "user", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<ViewRole>("user");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("role");
      if (saved === "user" || saved === "admin") setRoleState(saved);
    } catch {}
  }, []);

  const setRole = (r: ViewRole) => {
    setRoleState(r);
    try {
      localStorage.setItem("role", r);
    } catch {}
  };

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
