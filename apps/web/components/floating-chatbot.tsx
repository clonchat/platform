"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useChatbot, ChatWidget } from "@/components/ui/chat-widget";

export function FloatingChatbot() {
  const { isOpen, open, close } = useChatbot();

  const handleClick = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return (
    <>
      <ChatWidget />
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-xl transition-shadow group"
      >
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute inset-0 bg-[#2563eb] rounded-full opacity-30 group-hover:opacity-0 transition-opacity"
          />
        )}
        <MessageCircle className="h-7 w-7 relative z-10" />
        
        {/* Notification badge - solo cuando está cerrado */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </>
  );
}
