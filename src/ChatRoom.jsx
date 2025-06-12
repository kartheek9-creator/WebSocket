import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

function ChatRoom({ username, password }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

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
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {username}!</h2>
      <div
        style={{
          height: '400px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, idx) => {
          const isOwn = msg.startsWith(`${username}:`);
          const isSystem = !msg.includes(":");
          return (
            <div
              key={idx}
              style={{
                textAlign: isSystem ? 'center' : isOwn ? 'right' : 'left',
                color: isSystem ? 'gray' : 'black',
                marginBottom: '5px',
              }}
            >
              {msg}
            </div>
          );
        })}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type message..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
