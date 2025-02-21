import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../../redux/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const Login = ({ ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidCredentialsText, setShowInvalidCredentialsText] =
    useState(false);
  const [errorText, setErrorText] = useState("");
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [showLoginSuccessText, setShowLoginSuccessText] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>();
  const [adminpagelogin, setAdminpagelogin] = useState(false);
  const search = useLocation().search;
  const [emailInputFocusedFirstTime, setEmailInputFocusedFirstTime] =
    useState(false);
  const [passwordInputFocusedFirstTime, setPasswordInputFocusedFirstTime] =
    useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const returnUrl = new URLSearchParams(search).get("returnUrl");
    if (props.adminPageLogin) {
      setAdminpagelogin(props.adminPageLogin);
    }
    setReturnUrl(returnUrl);
  }, []);

  const handleLogin = () => {
    dispatch(
      loginAsync(email, password, (result: any, userRole: string) => {
        if (result.success) {
          //if was admin page login it automatically displays admin page and no need to redirect. (cause of routes configured in App.tsx)
          if (!adminpagelogin || (adminpagelogin && userRole !== "Admin")) {
            setShowLoginSuccessText(true);
            setTimeout(() => {
              navigate("/" + (returnUrl ?? ""));
            }, 1500);
          }
        } else {
          setErrorText(result.message);
          setShowInvalidCredentialsText(true);
        }
      })
    );
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          {showLoginSuccessText && (
            <Typography variant="h5" sx={{ color: "green" }}>
              Login successfull. redirecting...
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowInvalidCredentialsText(false);
              }}
              onFocus={() => {
                setEmailInputFocusedFirstTime(true);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor:
                      emailInputFocusedFirstTime && email.length === 0
                        ? "red"
                        : "inherit",
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowInvalidCredentialsText(false);
              }}
              onFocus={() => {
                setPasswordInputFocusedFirstTime(true);
              }}
              onKeyUp={event => {
                if (event.key === 'Enter') {
                  handleLogin()
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor:
                      passwordInputFocusedFirstTime && password.length === 0
                        ? "red"
                        : "inherit",
                  },
                },
              }}
            />
            {showInvalidCredentialsText && (
              <Box component="span" sx={{ color: "red" }}>
                {errorText}
              </Box>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              disabled={email.length === 0 || password.length === 0}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Need registration?</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
