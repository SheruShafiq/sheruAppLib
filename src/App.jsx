import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Four0Four from "./Pages/404";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Four0Four />} />
      </Routes>
    </>
  );
}

export default App;
