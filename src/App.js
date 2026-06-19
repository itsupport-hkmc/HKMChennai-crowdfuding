import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AllRoutes from "./Routes/AllRoutes";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (window.fbq && location.pathname === '/srila-prabhupada-s-iskcon-thiruvanmiyur-campaign') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return (
   <>
    <AllRoutes />
   </>
  );
}

export default App;
