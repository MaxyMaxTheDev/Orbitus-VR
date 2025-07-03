"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { chat, ChatInput } from "@/ai/flows/chat";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatInput>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<ChatInput> = async (data) => {
    const userMessage: Message = { role: "user", content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const response = await chat({ message: data.message });
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error chatting with AI:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "p-3 rounded-lg max-w-[80%]",
                  message.role === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <User className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="p-3 rounded-lg bg-secondary flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-primary/30">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...register("message")}
            placeholder="Ask the assistant..."
            autoComplete="off"
            className="flex-1 bg-black/30 border-primary/50 focus:ring-accent"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading} className="bg-accent hover:bg-accent/80">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
         {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
      </div>
    </div>
  );
}
