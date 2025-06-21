"use client"
 
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"
import { useMemo, useState } from "react"
 
import { cn } from "@/lib/utils"
import { transcribeAudio } from "@/lib/utils/audio"
import { Chat } from "@/components/ui/chat"
 
const MODELS = [
  { id: "gemini-2.5-flash-preview-05-20", name: "gemini-2.5-flash-preview-05-20" },
  { id: "", name: "" },
]
 
export function ChatDemo(props) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const { data: session } = useSession()
  const mode = useMemo(() => {
    if (session?.user?.role === "paciente") return "paciente"
    if (session?.user?.role === "medico") return "medico"
    return "basico"
  }, [session])
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    status,
    setMessages,
  } = useChat({
    ...props,
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  })
 
  const isLoading = status === "submitted" || status === "streaming"

  let suggestions = ["O que é a BrailleWay?", "Quais planos a BrailleWay oferece?"]

  if (mode === "basico") {
    if (!session) suggestions.unshift("Como faço login ou cadastro?")
  } else if (mode === "paciente") {
    suggestions.unshift("Agendar uma consulta")
    suggestions.unshift("Quero ver meus dados")
  } else if (mode === "medico") {
    suggestions.unshift("Acessar meus dados de médico")
  }
 
  return (
    <div className={cn("flex", "flex-col", "h-[500px]", "w-full")}>
      <div className={cn("flex", "justify-end", "mb-2", "gap-2")}>
        {/* <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        {/* modo selecionado automaticamente pela sessão */}
      </div>
 
      <Chat
        className="grow"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        setMessages={setMessages}
        transcribeAudio={transcribeAudio}
        suggestions={suggestions}
      />
    </div>
  )
}