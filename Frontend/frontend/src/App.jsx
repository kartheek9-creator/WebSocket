import { useState } from 'react';
import ChatRoom from './ChatRoom';
import LoginForm from "./components/LoginForm"

function App() {
  const [user, setUser] = useState(null);
  console.log("the first one",user)
  
  const handleLogin = (user) => {
    setUser(user)
    console.log("the second one",user)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <>
  {!user ? (
    <LoginForm onLogin={handleLogin} />
  ) : (
    <ChatRoom username={user.username} password={user.password} />
  )}
</>

  );
}

export default App;
