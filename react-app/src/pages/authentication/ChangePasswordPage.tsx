import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { ChangePassword as ChangePasswordModel } from "../../models/changePassword";
import { authApi } from "../../api/apiAndInterceptor";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();
  const [showInvalidPasswordText, setShowInvalidPasswordText] = useState(false);
  const [
    oldPasswordInputFocusedFirstTime,
    setOldPasswordInputFocusedFirstTime,
  ] = useState(false);
  const [
    newPasswordInputFocusedFirstTime,
    setNewPasswordInputFocusedFirstTime,
  ] = useState(false);
  const [
    confirmPasswordInputFocusedFirstTime,
    setConfirmPasswordInputFocusedFirstTime,
  ] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.user?.userEmail) setEmail(auth.user!.userEmail);
  }, [auth]);

  const handleChangePassword = () => {
    let changePasswordObj: ChangePasswordModel = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    authApi()
      .changePassword(changePasswordObj)
      .then((res) => {
        navigate("/changepasswordsuccess");
      })
      .catch((error) => {
        setShowInvalidPasswordText(true);
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
          <Typography variant="h5">Change password</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              disabled={true}
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowInvalidPasswordText(false);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="oldPassword"
              name="oldPassword"
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setShowInvalidPasswordText(false);
              }}
              onFocus={() => {
                setOldPasswordInputFocusedFirstTime(true);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor:
                      oldPasswordInputFocusedFirstTime &&
                      oldPassword.length === 0
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
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setShowInvalidPasswordText(false);
              }}
              onFocus={() => {
                setNewPasswordInputFocusedFirstTime(true);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor:
                      newPasswordInputFocusedFirstTime &&
                      newPassword.length === 0
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
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setShowInvalidPasswordText(false);
              }}
              onFocus={() => {
                setConfirmPasswordInputFocusedFirstTime(true);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor:
                      confirmPasswordInputFocusedFirstTime &&
                      confirmPassword.length === 0
                        ? "red"
                        : "inherit",
                  },
                },
              }}
            />
            {showInvalidPasswordText && (
              <Box component="span" sx={{ color: "red" }}>
                {errorText}
              </Box>
            )}
            {newPassword !== confirmPassword &&
              newPasswordInputFocusedFirstTime &&
              confirmPasswordInputFocusedFirstTime && (
                <Box component="span" sx={{ color: "red" }}>
                  Passwords does not match.
                </Box>
              )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleChangePassword}
              disabled={
                email.length === 0 ||
                oldPassword.length === 0 ||
                newPassword.length === 0 ||
                newPassword !== confirmPassword ||
                confirmPassword.length === 0
              }
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ChangePassword;
