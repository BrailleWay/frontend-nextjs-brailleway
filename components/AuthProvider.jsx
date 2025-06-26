// components/AuthProvider.jsx - Auth.js v5
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}