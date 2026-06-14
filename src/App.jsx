import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./components/welcomepage/Welcome";
import CardBuilder from "./pages/cardBuilder/CardBuilder";
import CursorGlow from "./components/cursor/CursorGlow";

function App() {
  return (
    <BrowserRouter>
      <CursorGlow />

      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route
          path="/builder"
          element={<CardBuilder />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;