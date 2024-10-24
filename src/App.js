import "./App.css";
import "./App.css";
import IndexPage from "./pages/Index.jsx";

import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </HashRouter>
  );
}

export default App;
