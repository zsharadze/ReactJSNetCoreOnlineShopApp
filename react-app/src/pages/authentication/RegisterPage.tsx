import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import { validateEmail } from "../../helpers/emailValidator";
import Swal from "sweetalert2";
import { authApi } from "../../api/apiAndInterceptor";
import { useNavigate } from "react-router-dom";

const Register = () => {
  //const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);
  //const [emailInputFocused, setEmailInputFocused] = useState(false);
  const [emailInputFocusedFirstTime, setEmailInputFocusedFirstTime] =
    useState(false);
  //const [passwordInputFocused, setPasswordInputFocused] = useState(false);
  const [passwordInputFocusedFirstTime, setPasswordInputFocusedFirstTime] =
    useState(false);
  const [showInvalidEmailAddressText, setShowInvalidEmailAddressText] =
    useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setErrorText("Invalid email address");
      setShowInvalidEmailAddressText(true);
      return;
    }

    authApi()
      .register(email, password, registerAsAdmin)
      .then((res: any) => {
        Swal.fire({
          title: "Registration",
          text: "Registration successfull. You can login.",
          icon: "success",
        }).then(function () {
          navigate("/login");
        });
      })
      .catch((error) => {
        
      });
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
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowInvalidEmailAddressText(false);
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setPasswordInputFocusedFirstTime(true);
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
              </Grid>
              <Grid item xs={12} className="registerAsAdminCheckbox">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={registerAsAdmin}
                      onChange={(e) => {
                        setRegisterAsAdmin(e.target.checked);
                      }}
                      name="RegisterAsAdmin"
                    />
                  }
                  label="Register as admin"
                />
              </Grid>
              {showInvalidEmailAddressText && (
                <Box
                  component="span"
                  sx={{ color: "red", paddingLeft: "16px" }}
                >
                  {errorText}
                </Box>
              )}
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
              disabled={email.length === 0 || password.length === 0}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Need login?</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
