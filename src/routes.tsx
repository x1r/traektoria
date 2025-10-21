import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Layout";
import { VehiclesPage } from "./pages/vehicles";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <VehiclesPage />,
      },
      {
        path: "/vehicles",
        element: <VehiclesPage />,
      },
    ],
  },
]);
