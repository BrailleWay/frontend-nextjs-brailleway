import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
}

export function LoadingOverlay({ message = "Carregando..." }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
} 