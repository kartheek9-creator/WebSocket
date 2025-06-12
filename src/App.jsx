import { useState } from 'react';
import Login from './Login';
import ChatRoom from './ChatRoom';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <ChatRoom username={user.username} password={user.password} />
      )}
    </>
  );
}

export default App;
