import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import "./App.css";
import ChatProvider from "./context/ChatProvider";
function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/chats" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
