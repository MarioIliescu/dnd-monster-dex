import React from "react";
import ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import App from "./App";
import MonstersPage from "./pages/Monsters";
import AboutMonsters from "./pages/AboutMonsters";
import About from "./pages/About";
import "./index.css";

const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <MonstersPage /> },
            { path: "monster/:index", element: <AboutMonsters /> },
            { path: "about", element: <About /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);