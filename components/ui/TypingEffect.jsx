"use client";

export function TypingEffect({
  text = "Olá, como posso te ajudar?",
  className = "",
}) {
  return (
    <span className={`text-xl font-semibold ${className}`}>
      {text}
    </span>
  );
}
