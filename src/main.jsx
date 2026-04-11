import ReactDOM from "react-dom/client";
import "./Styles/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ThemeProvider from "./Context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import "react-toastify/dist/ReactToastify.css";
import LoaderProvider from "./Context/LoaderContext";
import "tippy.js/dist/tippy.css"; // Optional for styling
import AppDataProvider from "./Context/AppDataContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/*"
        element={
          <AppDataProvider>
            <ThemeProvider>
              <Provider store={store}>
                <LoaderProvider>
                  <App />
                </LoaderProvider>
              </Provider>
            </ThemeProvider>
          </AppDataProvider>
        }
      />
    </Routes>
  </BrowserRouter>,
);
