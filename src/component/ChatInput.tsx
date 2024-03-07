"use client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { FC, HTMLAttributes, useContext, useRef, useState } from "react";
import { nanoid } from "nanoid";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "@/lib/validators/message";
import { MessagesContext } from "@/context/messages";
import { CornerDownLeft, Loader2 } from "lucide-react";
interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}
const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const {
    addMessage,
    messages,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsMessageUpdating,
  } = useContext(MessagesContext);
  const { mutate: sendmessage, isPending } = useMutation({
    mutationFn: async (message: Message) => {
      const res = await fetch("api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [message] }),
      });
      return res.body;
    },
    onMutate(message) {
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("no stream found");
      const reader = stream.getReader();
      const id = nanoid();
      const resmess: Message = {
        id,
        isUserMessage: false,
        text: "",
      };
      addMessage(resmess);
      setIsMessageUpdating(true);
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { done: doneReading, value } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }
      setIsMessageUpdating(false);
      setInput("");
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
      console.log("success");
    },
  });
  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          ref={textareaRef}
          rows={2}
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const message: Message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
              };
              sendmessage(message);
            }
          }}
          value={input}
          disabled={isPending}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          placeholder="write a message ...."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400">
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CornerDownLeft className="w-3 h-3" />
            )}
          </kbd>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ChatInput;
