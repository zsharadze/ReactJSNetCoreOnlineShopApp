import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutAsync, setIsAuthenticated } from "../../redux/authSlice";
import { useLocation } from "react-router-dom";

const AuthVerify = (props: any) => {
  const dispatch = useDispatch<any>();
  const location = useLocation();

  useEffect(() => {
    let isAuthenticated = localStorage.getItem("isAuthenticated");
    let tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentDate = new Date();
    let tokenExpirationDate = new Date(tokenExpiration!);
    if (tokenExpirationDate > currentDate && isAuthenticated != null) {
      dispatch(setIsAuthenticated());
    } else {
      //token expired.
      dispatch(logoutAsync(() => {}));
    }
  }, [dispatch, location]);

  return null;
};

export default AuthVerify;
