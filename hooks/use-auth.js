"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";
  const isPending = status === "loading";

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToHomepage = () => {
    if (isAuthenticated) {
      router.push("/homepage");
    }
  };

  const redirectToLogin = () => {
    if (isUnauthenticated) {
      router.push("/login");
    }
  };

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isUnauthenticated,
    isPending,
    isLoading,
    logout,
    redirectToHomepage,
    redirectToLogin,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isUnauthenticated, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isUnauthenticated) {
      router.push("/login");
    }
  }, [isUnauthenticated, router]);

  return {
    isAuthenticated,
    isUnauthenticated,
    isPending,
  };
}

export function useRedirectIfAuthenticated() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/homepage");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
} 