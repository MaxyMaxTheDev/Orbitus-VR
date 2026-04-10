"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, User } from "lucide-react";
import { vrChat } from "@/ai/flows/vr-chat-flow";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from "@/ai/schemas";
import { get, set } from "@/lib/idb";
import { useSettings } from "@/contexts/settings-context";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

const initialMessages: Message[] = [
  { author: 'SynthRider', text: "What's up? The vibes in this lobby are rad." },
  { author: 'Oracle', text: "The data streams converge. Welcome, traveler." }
];

export function VRChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { isGuest } = useSettings();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedMessages = await get<Message[]>('vr-chat-messages');
        if (storedMessages && storedMessages.length > 0) {
          setMessages(storedMessages);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsHistoryLoaded(true);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    // Skip saving if Guest
    if (isHistoryLoaded && !isGuest) {
      set('vr-chat-messages', messages).catch(error => {
        console.error("Failed to save chat history:", error);
      });
    }
  }, [messages, isHistoryLoaded, isGuest]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const scrollToBottom = () => {
    setTimeout(() => {
        scrollAreaRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const userMessage: Message = { author: "You", text: data.message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    reset();
    scrollToBottom();

    try {
      const response = await vrChat({ history: newMessages, userMessage: data.message });
      setMessages((prev) => [...prev, ...response.responses]);
    } catch (error) {
      console.error("Error in VR Chat:", error);
      const errorMessage: Message = {
        author: "System",
        text: "A participant has disconnected.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };
  
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3",
                message.author === "You" ? "justify-end" : "justify-start"
              )}
            >
              {message.author !== "You" && (
                <Avatar>
                  <AvatarFallback className={cn(
                      "bg-secondary text-secondary-foreground",
                      message.author === "SynthRider" && "bg-pink-500",
                      message.author === "Oracle" && "bg-teal-500",
                  )}>
                    {message.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-1 items-start">
                {message.author !== "You" && <p className="text-xs text-muted-foreground ml-3">{message.author}</p>}
                <div
                    className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    message.author === "You"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary"
                    )}
                >
                    <p className="text-sm">{message.text}</p>
                </div>
              </div>
              {message.author === "You" && (
                 <Avatar>
                    <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="w-5 h-5"/>
                    </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
                 <Avatar>
                    <AvatarFallback className="bg-secondary">
                        <Loader2 className="w-5 h-5 animate-spin"/>
                    </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-secondary flex items-center">
                    <p className="text-sm text-muted-foreground italic">... a participant is typing</p>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-primary/30">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...register("message")}
            placeholder="Send a message..."
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
