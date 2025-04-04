import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Four0Four from "./Pages/404";
import "./App.css";
import { SnackbarProvider } from "notistack";
import { createRef } from "react";
import CustomSnackbar from "./Components/CustomSnackbar";
import Post from "./Pages/Post";
function App() {
  const notistackRef = createRef();

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={800000}
      ref={notistackRef}
      Components={{
        error: (props) => (
          <CustomSnackbar {...props} severity="error" variant="outlined" />
        ),
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Four0Four />} />
        <Route path="/posts/:id" element={<Post />} />
      </Routes>
    </SnackbarProvider>
  );
}

export default App;
