import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChangePasswordSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, []);
  return (
    <Box display="flex" justifyContent="center">
      <Typography variant="h5" sx={{ color: "green" }}>
        Change password successfull. redirecting to main...
      </Typography>
    </Box>
  );
};
export default ChangePasswordSuccess;
