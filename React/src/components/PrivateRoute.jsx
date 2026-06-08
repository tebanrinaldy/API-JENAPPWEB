import { Navigate } from "react-router-dom";
function PrivateRoute({ children }) {
  const user = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");
  if (!user || !token) {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default PrivateRoute;
