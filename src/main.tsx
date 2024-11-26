import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StartPage from "./components/StartPage.tsx";
import { SetSocket } from "./utils/socket.ts";
import WaitPage from "./components/WaitPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GamePage from "./components/GamePage.tsx";
import GameEnd from "./components/GameEnd.tsx";

// TODO: Play test
// TODO: End game sound continues (should stop)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <StartPage />,
  },
  {
    path: "/game-time/:roomId/wait",
    element: <WaitPage />,
  },
  {
    path: "/game-time/:roomId/play",
    element: <GamePage />,
  },
  {
    path: "/game-time/:roomId/end",
    element: <GameEnd />,
  },
  {
    path: "/tests",
    element: <div className="w-full h-full p-4 flex justify-center">TESTS</div>,
  },
]);

const queryClient = new QueryClient();

SetSocket();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
