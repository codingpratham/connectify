import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@radix-ui/react-avatar";
import { Users, Send, ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const roomId = "room-abc";

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-messages-${roomId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Error parsing messages from localStorage:", e);
      }
    }
  }, [roomId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`chat-messages-${roomId}`, JSON.stringify(messages));
  }, [messages, roomId]);

  // Connect WebSocket
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("✅ WebSocket connection opened");
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    socket.onmessage = (event) => {
      const data = event.data;
      setMessages((prev) => [...prev, data]);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("🔒 WebSocket closed");
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: input,
          roomId,
        },
      })
    );

    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-full max-w-3xl flex flex-col h-[600px] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-purple-200">
              <div className="bg-purple-200 rounded-full w-full h-full flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold">Chat Room</h2>
              <p className="text-xs text-gray-500">{roomId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              No messages yet. Start chatting!
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1 bg-purple-200">
                <div className="bg-purple-200 rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
              </Avatar>
              <div className="max-w-[70%]">
                <div className="rounded-2xl px-4 py-2 bg-white shadow-sm">
                  <p className="text-sm">{message}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t flex items-center">
          <Input
            ref={inputRef}
            type="text"
            id="message"
            placeholder="Type your message"
            className="flex-1 rounded-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="default"
            size="icon"
            className="rounded-full ml-2 bg-purple-600 hover:bg-purple-700"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;

