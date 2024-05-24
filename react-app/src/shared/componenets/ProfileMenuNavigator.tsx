import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutAsync } from "../../redux/authSlice";

function ProfileMenuNavigator() {
  const search = useLocation().search;
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  useEffect(() => {
    const goToUrl = new URLSearchParams(search).get("goToUrl");
    if (goToUrl !== "logout") navigate("/" + goToUrl);
    else {
      dispatch(
        logoutAsync(() => {
          navigate("/signoutsuccess");
        })
      );
    }
  }, []);

  return null;
}
export default ProfileMenuNavigator;
