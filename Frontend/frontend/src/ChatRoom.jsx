import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

function ChatRoom({ username, password }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  console.log("This is the username and password",username, password);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${username}/${password}`);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      setMessages((prev) => [...prev, '❌ Disconnected from server']);
    };

    return () => ws.current.close();
  }, [username, password]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      ws.current.send(input);
    //   setMessages((prev) => [...prev, `${username}: ${input}`]);
      setInput('');
    }
  };

  return (
     <div className="flex justify-center items-center h-screen bg-gray-100 w-full">
      <div className="w-full max-w-md h-[90vh] flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-green-600 text-white text-lg font-semibold px-4 py-3">
          Welcome, {username}!
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg, idx) => {
            const isOwn = msg.startsWith(`${username}:`);
            const isSystem = !msg.includes(":");
            return (
              <div
                key={idx}
                className={`flex ${isSystem ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl shadow text-white text-sm ${
                    isSystem
                      ? 'bg-gray-400'
                      : isOwn
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
                >
                  {msg}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center px-4 py-3 bg-white border-t border-gray-300">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
