import React from "react";
import "../../App.css";
import { Menu, MenuItem } from "@mui/material";
import { ProfileMenuGoTo } from "../../models/profileMenuGoToEnum";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export default function ProfileMenuLayout(props: any) {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <Menu
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={props.menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={props.isMenuOpen}
      onClose={props.handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          props.handleMenuClose(ProfileMenuGoTo.MyOrders);
        }}
      >
        My Orders
      </MenuItem>
      {auth.isAuthenticated && (
        <MenuItem
          onClick={() => {
            props.handleMenuClose(ProfileMenuGoTo.ChangePassword);
          }}
        >
          Change Password
        </MenuItem>
      )}
      {auth.isAuthenticated && (
        <MenuItem
          onClick={() => {
            props.handleMenuClose(ProfileMenuGoTo.Logout);
          }}
        >
          Sign Out
        </MenuItem>
      )}
      {!auth.isAuthenticated && (
        <MenuItem
          onClick={() => {
            props.handleMenuClose(ProfileMenuGoTo.Login);
          }}
        >
          Sign in
        </MenuItem>
      )}
      {!auth.isAuthenticated && (
        <MenuItem
          onClick={() => {
            props.handleMenuClose(ProfileMenuGoTo.Register);
          }}
        >
          Register
        </MenuItem>
      )}
    </Menu>
  );
}
