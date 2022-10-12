import React from "react";
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";
const NavBar = (props) => {
  return (
    <AppBar
      position="absolute"
      sx={{
        display: "flex",
        width: "70%",
        mx: "auto",
        bgcolor: "#fafafa",
        p: 0.5,
        borderRadius: "20px",
        left: "0%",
        right: "0%",
      }}
    >
      <Toolbar>
        <Stack spacing={3} direction="row" mx="auto" sx={{ display: "flex" }}>
          <Typography variant="h6" component="h1">
            <Link to="" style={{ textDecoration: "none", color: "black" }}>
              HOME
            </Link>
          </Typography>
          <Typography variant="h6" component="h1">
            <Link
              to="/Mint-nft"
              style={{ textDecoration: "none", color: "black" }}
            >
              CREATE
            </Link>
          </Typography>
          <Typography variant="h6" component="h1">
            <Link
              to="/my-profile"
              style={{ textDecoration: "none", color: "black" }}
            >
              MY PROFILE
            </Link>
          </Typography>
        </Stack>
        <Button
          sx={{ display: "flex", width: "12%" }}
          size="small"
          variant="contained"
          onClick={props.getProvider}
          endIcon={<AccountBalanceWalletIcon />}
        >
          {props.account
            ? `${props.account.slice(0, 6)}.....${props.account.slice(38, 42)}`
            : "Connect To Wallet"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
