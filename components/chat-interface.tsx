"use client";
import { JSX } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Send,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ImageIcon,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type React from "react";

type SuggestionType = {
  id: string;
  text: string;
};

export function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
        role: "assistant",
      },
    ],
  });

  const [suggestions, setSuggestions] = useState<SuggestionType[]>([
    { id: "1", text: "Bạn có thể giúp tôi viết email không?" },
    { id: "2", text: "Làm thế nào để học lập trình?" },
    { id: "3", text: "Giải thích về trí tuệ nhân tạo" },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check system preference for dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageAttachment) return;

    setShowSuggestions(false);
    handleSubmit(e);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageAttachment(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Không hỗ trợ định dạng",
          description: "Chỉ hỗ trợ tệp hình ảnh",
          variant: "destructive",
        });
      }
    }
  };

  const removeAttachment = () => {
    setImageAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
      variant: "default",
    });
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFeedback = (type: "like" | "dislike", messageId: string) => {
    // In a real app, you would send this feedback to your backend
    toast({
      title:
        type === "like"
          ? "Cảm ơn phản hồi tích cực"
          : "Cảm ơn phản hồi của bạn",
      description: "Chúng tôi sẽ sử dụng phản hồi này để cải thiện trải nghiệm",
      variant: "default",
    });
  };

  // Simple function to format code blocks in messages
  const formatMessageContent = (content: string) => {
    // Split by code block markers
    const parts = content.split(/```([a-z]*)\n([\s\S]*?)```/g);

    if (parts.length === 1) {
      // No code blocks, return the content as is
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // Process parts and render code blocks
    const elements: JSX.Element[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        // Regular text
        if (parts[i]) {
          elements.push(
            <div key={`text-${i}`} className="whitespace-pre-wrap mb-2">
              {parts[i]}
            </div>
          );
        }
      } else if (i % 3 === 1) {
        // Language (we don't render this directly)
        continue;
      } else if (i % 3 === 2) {
        // Code block content
        elements.push(
          <div
            key={`code-${i}`}
            className="bg-gray-800 text-gray-100 dark:bg-gray-900 dark:text-gray-100 p-3 rounded-md mb-3 overflow-x-auto font-mono text-sm"
          >
            {parts[i]}
          </div>
        );
      }
    }

    return <>{elements}</>;
  };

  return (
    <div className={cn("flex flex-col h-[80vh]", isDarkMode && "dark")}>
      <Card className="flex-grow overflow-hidden mb-4 border-primary-color/20 shadow-lg">
        <div className="bg-gradient-to-r from-primary-color to-primary-color/80 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">AI Assistant</h2>
              <p className="text-xs opacity-80">
                Trả lời dựa trên dữ liệu đã huấn luyện
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isLoading && (
              <Button
                onClick={() => stop()}
                variant="ghost"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 p-0"
              >
                <span className="sr-only">Dừng</span>
                <span className="h-3 w-3 bg-white rounded-sm"></span>
              </Button>
            )}
            <Button
              onClick={() => reload()}
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 p-0"
              disabled={isLoading || messages.length <= 1}
            >
              <span className="sr-only">Tạo lại</span>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4 h-[calc(80vh-120px)] overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950 dark:text-white">
          <div className="space-y-4 py-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 mr-2">
                      <Avatar>
                        <AvatarImage src="/placeholder-ai.png?height=40&width=40" />
                        <AvatarFallback className="bg-primary-color text-white">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary-color to-primary-color/90 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark-color dark:text-white shadow-md"
                    }`}
                  >
                    {formatMessageContent(message.content)}

                    {message.role === "assistant" && (
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTimestamp()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(message.content)
                                  }
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-primary-color hover:bg-primary-color/10 rounded-full"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sao chép</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFeedback("like", message.id)
                                  }
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hữu ích</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFeedback("dislike", message.id)
                                  }
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Không hữu ích</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 ml-2">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.png?height=40&width=40" />
                        <AvatarFallback className="bg-accent-color text-white">
                          User
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="flex-shrink-0 mr-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-primary-color text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0,
                      }}
                      className="w-2 h-2 bg-primary-color rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-primary-color rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-primary-color rounded-full"
                    />
                  </div>
                  <span className="text-dark-color dark:text-white text-sm">
                    Đang trả lời...
                  </span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
                  Đã xảy ra lỗi:{" "}
                  {error.message ||
                    "Không thể kết nối với AI. Vui lòng thử lại sau."}
                </div>
              </motion.div>
            )}

            {showSuggestions && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-2 my-4"
              >
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    className="bg-white dark:bg-gray-800 border-primary-color/30 text-primary-color dark:text-blue-400 hover:bg-primary-color/10 dark:hover:bg-blue-900/20 rounded-full text-sm"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {imageAttachment && (
        <div className="mb-2 relative inline-block">
          <img
            src={imageAttachment || "/placeholder.svg"}
            alt="Attachment"
            className="h-20 rounded-md border border-primary-color/30"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={removeAttachment}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="relative">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập câu hỏi của bạn..."
          className="pr-24 border-primary-color/30 focus-visible:ring-primary-color rounded-full py-6 shadow-md dark:bg-gray-800 dark:text-white"
        />
        <div className="absolute right-1 top-1 flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full w-10 h-10 p-0 text-gray-500 hover:text-primary-color hover:bg-primary-color/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Đính kèm hình ảnh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="submit"
            disabled={isLoading || (!input.trim() && !imageAttachment)}
            className="bg-primary-color hover:bg-primary-color/90 rounded-full w-10 h-10 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
