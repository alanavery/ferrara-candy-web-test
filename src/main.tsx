import React from "react";
import ReactDOM from "react-dom/client";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import "./index.css";
import { RouteProvider } from "./contexts/RouteContext";
import { FormDataProvider } from "./contexts/FormDataContext";
// import { EmailForm } from "./screens/EmailForm/index.tsx";
// import { Layout } from "./components/Layout/index.tsx";
// import { Instructions } from "./screens/Instructions/index.tsx";
// import { NotWinner } from "./screens/NotWinner/index.tsx";
// import { Winner } from "./screens/Winner/index.tsx";
// import { Scan } from "./screens/Scan/index.tsx";
// import { Animation } from "./components/Animation/index.tsx";
// import { WinnerFormConfirmation } from "./screens/WinnerFormConfirmation/index.tsx";
// import { AlreadyAwarded } from "./screens/AlreadyAwarded/index.tsx";
// import { HomeAMOE } from "./screens/HomeAMOE/index.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <Layout footerProps={{ hideBottomImages: true }} />
//     ),
//     children: [
//       {
//         path: "",
//         element: <HomeAMOE />,
//       },
//     ],
//   },
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "instructions",
//         element: <Instructions />,
//       },
//     ],
//   },
//   {
//     path: "/",
//     element: (
//       <Layout
//         footerProps={{ showFreeMethodEntryMessage: true }}
//       />
//     ),
//     children: [
//       {
//         path: "capture",
//         element: <EmailForm />,
//       },
//     ],
//   },
//   {
//     path: "/",
//     element: (
//       <Layout headerProps={{ centerImage: "winner" }} />
//     ),
//     children: [
//       {
//         path: "winner",
//         element: <Winner />,
//       },
//       {
//         path: "winner-confirmation",
//         element: <WinnerFormConfirmation />,
//       },
//     ],
//   },
//   {
//     path: "/",
//     element: (
//       <Layout headerProps={{ centerImage: "looser" }} >
//     ),
//     children: [
//       {
//         path: "not-winner",
//         element: <NotWinner />,
//       },
//       {
//         path: "already-awarded",
//         element: <AlreadyAwarded />,
//       },
//     ],
//   },
//   { path: "/camera", element: <Scan /> },
//   { path: "/animation", element: <Animation /> },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <FormDataProvider>
      <RouteProvider />
    </FormDataProvider>
  // </React.StrictMode>
);
