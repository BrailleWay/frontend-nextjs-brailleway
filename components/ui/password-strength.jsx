"use client";

import { useState, useEffect } from "react";

export function PasswordStrength({ password }) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback("");
      return;
    }

    let score = 0;
    const feedbacks = [];

    // Comprimento mínimo
    if (password.length >= 6) {
      score += 1;
    } else {
      feedbacks.push("Pelo menos 6 caracteres");
    }

    // Comprimento bom
    if (password.length >= 8) {
      score += 1;
    }

    // Comprimento excelente
    if (password.length >= 12) {
      score += 1;
    }

    // Contém letra minúscula
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedbacks.push("Adicione uma letra minúscula");
    }

    // Contém letra maiúscula
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedbacks.push("Adicione uma letra maiúscula");
    }

    // Contém número
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedbacks.push("Adicione um número");
    }

    // Contém caractere especial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedbacks.push("Adicione um caractere especial");
    }

    setStrength(score);
    setFeedback(feedbacks.join(", "));
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    if (strength <= 6) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Fraca";
    if (strength <= 4) return "Média";
    if (strength <= 6) return "Boa";
    return "Forte";
  };

  const getStrengthTextColor = () => {
    if (strength <= 2) return "text-red-600";
    if (strength <= 4) return "text-yellow-600";
    if (strength <= 6) return "text-blue-600";
    return "text-green-600";
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Força da senha:</span>
        <span className={`text-xs font-medium ${getStrengthTextColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / 7) * 100}%` }}
        />
      </div>
      
      {feedback && (
        <p className="text-xs text-gray-500">
          Dicas: {feedback}
        </p>
      )}
    </div>
  );
} 