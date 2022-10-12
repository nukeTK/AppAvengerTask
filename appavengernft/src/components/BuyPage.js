import {
  Alert,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useLocation } from "react-router";
import Web3 from "web3";

const BuyPage = (props) => {
  const [openSnack, setOpenSnack] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  //BUY FUNCTION
  const buyNFT = async () => {
    try {
      setOpen(true);
      const price = Number(location.state.data.price) + 0.01; //ADDING LISITING PRICE 
      await props.web3.contract.methods
        .executeSell(location.state.data.tokenId)
        .send({
          from: props.account,
          value: Web3.utils.toWei(String(price), "ether"), 
        });

      setTimeout(() => {
        setOpen(false);
        setOpenSnack(true);
      }, 1000);
    } catch (error) {
      setOpen(false);
      setError(true);
    }
  };
  
  const handleclose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <Box
      sx={{ backgroundColor: "#3B3B3B", position: "absolute", width: "100%" }}
    >
      <Stack direction="row" spacing={3} sx={{ my: "100px", mx: "400px" }}>
        <Card
          elevation={10}
          sx={{
            width: 600,
            height: 800,
            borderRadius: "20px",
            backgroundColor: "#F2ECFF",
          }}
        >
          <CardMedia
            component="img"
            alt="nft"
            height="800"
            image={location.state.data.image}
            sx={{
              objectFit: "contain",
              objectPosition: "center",
              borderRadius: "20px",
            }}
          />
        </Card>
        <Card
          elevation={10}
          sx={{
            width: 800,
            height: 800,
            borderRadius: "20px",
            border: "10px solid #F2ECFF ",
            p: 5,
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              <Stack spacing={1} direction="column">
                <Typography variant="h4" fontFamily="sans-serif">
                  {location.state.data.name}
                </Typography>
                <Typography variant="h6">
                  TokenId: #{location.state.data.tokenId}
                </Typography>
              </Stack>
              <Divider />
              <Stack spacing={0}>
                <Typography variant="h6">Description:</Typography>
                <Typography variant="subtitle1">
                  {location.state.data.description}
                </Typography>
              </Stack>
              <Divider />
              <Typography variant="subtitle1">
                Owned by: {location.state.data.owner}
              </Typography>
              <Divider />
              <Typography variant="h6">
                Price: {location.state.data.price} ETH
              </Typography>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Stack spacing={1}>
              {props.account === location.state.data.owner ||
              props.account === location.state.data.seller ? (
                <Typography variant="h6" color="error.light">
                  Owned By You!!!
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => buyNFT()}
                >
                  Buy
                </Button>
              )}
              <Typography variant="overline" fontWeight={500}>
                Check Purchased item in my space
              </Typography>
            </Stack>
          </CardActions>
          <Divider />
        </Card>
      </Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleclose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {error ? (
          <Alert
            onClose={handleclose}
            severity="error"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Error
          </Alert>
        ) : (
          <Alert
            onClose={handleclose}
            variant="filled"
            severity="success"
            sx={{ width: "100%" }}
          >
            Token Successfully Purchased!!!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default BuyPage;
