import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  ThemeContextProvider,
  AuthContextProvider,
  NoteContextProvider,
} from "./contexts";
import { Archive, Register, Login, Trash, Notes } from "./pages/index.js";

import { AuthLayout } from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route
          index
          element={
            <AuthLayout authentication>
              <Notes />
            </AuthLayout>
          }
        />
        <Route
          path="archive"
          element={
            <AuthLayout authentication>
              <Archive />
            </AuthLayout>
          }
        />
        <Route
          path="trash"
          element={
            <AuthLayout authentication>
              <Trash />
            </AuthLayout>
          }
        />
      </Route>
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        }
      />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <NoteContextProvider>
          <RouterProvider router={router} />
        </NoteContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
