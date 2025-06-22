"use client";
import { forwardRef, useCallback, useRef, useState, useEffect } from "react";
import { ArrowDown, ThumbsDown, ThumbsUp, Volume2, VolumeX } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAutoScroll } from "@/hooks/use-auto-scroll"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { MessageInput } from "@/components/ui/message-input"
import { MessageList } from "@/components/ui/message-list"
import { PromptSuggestions } from "@/components/ui/prompt-suggestions"
import Image from "next/image";

import { motion } from "framer-motion";
 
import { TypingEffect } from "./TypingEffect"; // <-- importa o TypingEffect certinho
import { speak } from "@/lib/utils/tts"

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
  setMessages,
  transcribeAudio
}) {
  const lastMessage = messages.at(-1)
  const isEmpty = messages.length === 0
  const isTyping = lastMessage?.role === "user"

  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const lastSpokenId = useRef(null)

  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    const last = messages.at(-1)
    if (!voiceEnabled || !last || last.role !== "assistant") return
    if (lastSpokenId.current === last.id) return

    let text = last.content
    if (!text && last.parts && last.parts.length > 0) {
      text = last.parts
        .filter((p) => p.type === "text" && p.text)
        .map((p) => p.text)
        .join(" ")
    }
    if (text) {
      speak(text)
      lastSpokenId.current = last.id
    }
  }, [messages, voiceEnabled])

  // Enhanced stop function that marks pending tool calls as cancelled
  const handleStop = useCallback(() => {
    stop?.()

    if (!setMessages) return

    const latestMessages = [...messagesRef.current]
    const lastAssistantMessage = latestMessages.findLast((m) => m.role === "assistant")

    if (!lastAssistantMessage) return

    let needsUpdate = false
    let updatedMessage = { ...lastAssistantMessage }

    if (lastAssistantMessage.toolInvocations) {
      const updatedToolInvocations = lastAssistantMessage.toolInvocations.map((toolInvocation) => {
        if (toolInvocation.state === "call") {
          needsUpdate = true
          return {
            ...toolInvocation,
            state: "result",

            result: {
              content: "Tool execution was cancelled",
              __cancelled: true, // Special marker to indicate cancellation
            }
          };
        }
        return toolInvocation
      })

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          toolInvocations: updatedToolInvocations,
        }
      }
    }

    if (lastAssistantMessage.parts && lastAssistantMessage.parts.length > 0) {
      const updatedParts = lastAssistantMessage.parts.map((part) => {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation &&
          part.toolInvocation.state === "call"
        ) {
          needsUpdate = true
          return {
            ...part,
            toolInvocation: {
              ...part.toolInvocation,
              state: "result",
              result: {
                content: "Tool execution was cancelled",
                __cancelled: true,
              },
            },
          }
        }
        return part
      })

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          parts: updatedParts,
        }
      }
    }

    if (needsUpdate) {
      const messageIndex = latestMessages.findIndex((m) => m.id === lastAssistantMessage.id)
      if (messageIndex !== -1) {
        latestMessages[messageIndex] = updatedMessage
        setMessages(latestMessages)
      }
    }
  }, [stop, setMessages, messagesRef])

  const messageOptions = useCallback((message) => ({
    actions: onRateResponse ? (
      <>
        <div className="border-r pr-1">
          <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onRateResponse(message.id, "thumbs-up")}>
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onRateResponse(message.id, "thumbs-down")}>
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </>
    ) : (
      <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
    ),
  }), [onRateResponse])

  return (
    <ChatContainer className={className}>
{isEmpty && append && suggestions ? (

<PromptSuggestions
  label={
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={80}
          className="rounded-full"
        />
      </motion.div>

      <TypingEffect
        text="Olá, como posso te ajudar?"
        className="text-[#2a2a2a]"
      />
    </div>
  }
  append={append} // <-- CORREÇÃO: Passe a prop 'append' original
  suggestions={suggestions} // <-- CORREÇÃO: Passe a prop 'suggestions' original
/>

) : null}
      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList messages={messages} isTyping={isTyping} messageOptions={messageOptions} />
        </ChatMessages>
      ) : null}
      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}>
        {({ files, setFiles }) => (
          <>
            <MessageInput
              value={input}
              onChange={handleInputChange}
              allowAttachments
              files={files}
              setFiles={setFiles}
              stop={handleStop}
              isGenerating={isGenerating}
              transcribeAudio={transcribeAudio} />
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label={voiceEnabled ? "Disable voice output" : "Enable voice output"}
                onClick={() => setVoiceEnabled((v) => !v)}>
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = "Chat"

export function ChatMessages({
  messages,
  children
}) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages])

  return (
    <div
      className="grid grid-cols-1 overflow-y-auto pb-4"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}>
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">
        {children}
      </div>
      {!shouldAutoScroll && (
        <div
          className="pointer-events-none flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="pointer-events-auto h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
              size="icon"
              variant="ghost">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid max-h-full w-full grid-rows-[1fr_auto]", className)}
      {...props} />
  );
})
ChatContainer.displayName = "ChatContainer"

export const ChatForm = forwardRef(({ children, handleSubmit, isPending, className }, ref) => {
  const [files, setFiles] = useState(null)

  const onSubmit = (event) => {
    if (!files) {
      handleSubmit(event)
      return
    }

    const fileList = createFileList(files)
    handleSubmit(event, { experimental_attachments: fileList })
    setFiles(null)
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children({ files, setFiles })}
    </form>
  );
})
ChatForm.displayName = "ChatForm"

function createFileList(files) {
  const dataTransfer = new DataTransfer()
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file)
  }
  return dataTransfer.files
}
