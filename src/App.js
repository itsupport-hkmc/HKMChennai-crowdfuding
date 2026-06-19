import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AllRoutes from "./Routes/AllRoutes";

function App() {
  const location = useLocation();



  return (
   <>
    <AllRoutes />
   </>
  );
}

export default App;
