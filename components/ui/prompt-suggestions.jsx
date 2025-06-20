export function PromptSuggestions({
  label,
  append,
  suggestions,
}) {
  return (
    <div className="space-y-6">
      {/* Label */}
      <h2 className="text-center text-3xl font-extrabold text-neutral-800">
        {label}
      </h2>

      {/* Botões de sugestões */}
      <div className="flex flex-wrap gap-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-5 py-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:scale-105 hover:bg-neutral-50 hover:shadow-md active:scale-100"
          >
            <p className="text-center">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
