import { useEffect } from "react";
import { createChat } from "@n8n/chat";

export function useN8nChat(isEnabled) {
  useEffect(() => {
    if (isEnabled) {
      createChat({
        webhookUrl: import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL,
        mode: "window",
        showWelcomeScreen: false,
        initialMessages: [
          "Hi there! What do you wanna know about your videos?",
        ],
      });
    }

    return () => {
      const chatWidget = document.querySelector(".n8n-chat");
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, [isEnabled]);
}
