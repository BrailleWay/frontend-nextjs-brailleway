"use client";

import { useRequireAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProtectedRoute({ children, fallback }) {
  const { isAuthenticated, isPending } = useRequireAuth();

  // Mostra loading enquanto verifica autenticação
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, o hook já redirecionou para login
  if (!isAuthenticated) {
    return null;
  }

  // Se está autenticado, mostra o conteúdo
  return children || fallback;
} 