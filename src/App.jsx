import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./components/welcomepage/Welcome";
import CursorGlow from "./components/cursor/CursorGlow"

function App() {
  return (
    <BrowserRouter>
      <CursorGlow />
      <Welcome/>
    </BrowserRouter>
  );
}

export default App;