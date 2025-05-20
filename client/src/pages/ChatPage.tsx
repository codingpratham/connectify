import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      const userId = localStorage.getItem('userId'); // Ensure this exists
      socket.send(JSON.stringify({ type: 'init', userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, `${data.from}: ${data.content}`]);
      }
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    const userId = localStorage.getItem('userId');
    if (ws && input) {
      ws.send(JSON.stringify({
        type: 'message',
        content: input,
        recipientId: targetUserId,
      }));
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  return (
    <div className="p-4 h-screen text-white bg-black">
      <h2 className="text-xl font-bold mb-4">Chat with {targetUserId}</h2>
      <div className="bg-gray-800 p-4 rounded h-96 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-900"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
