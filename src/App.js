// import Home from "./Home";
// import Watch from "./Watch";
import "./App.css";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import * as React from "react";
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
const Home = React.lazy(() => import("./Home"));
const Watch = React.lazy(() => import("./Watch"));

function App() {

  return (
    <HashRouter>
     
      <div className="p-3  bg-gradient-to-br from-black via-gray-900 to-black bg-cover">
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense fallback={<LoadingPage />}>
                <Home />
                {/* <LoadingPage /> */}
              </React.Suspense>
            }
          />
          <Route
            path="/Watch"
            element={
              <React.Suspense fallback={<LoadingPage />}>
                <Watch />
                {/* <LoadingPage /> */}
              </React.Suspense>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}
function LoadingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <BeatLoader color={"#ffffff"} loading={true} css={css} size={50} />
    </div>
  );
}
export default App;
