import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function OrderPlaced() {
  useEffect(() => {}, []);

  return (
    <Box>
      <Box>
        <Box>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", color: "success.main" }}
          >
            Order Placed Successfully
          </Typography>
          <Box sx={{ textAlign: "center", color: "white", mt: "10px" }}>
            <Link to="/">
              <Button
                style={{
                  borderRadius: 35,
                  backgroundColor: "#21b6ae",
                  padding: "18px 18px",
                  fontSize: "16px",
                }}
                variant="contained"
              >
                Back to products
              </Button>
            </Link>
            <br />
            <br />
            <Link to="/myorders">
              <Button
                style={{
                  borderRadius: 35,
                  backgroundColor: "green",
                  padding: "18px 18px",
                  fontSize: "16px",
                }}
                variant="contained"
              >
                My Orders
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default OrderPlaced;
