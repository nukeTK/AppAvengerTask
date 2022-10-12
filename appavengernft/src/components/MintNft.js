import React, { useState } from "react";
import Web3 from "web3";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  createTheme,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import styled from "@emotion/styled";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
const Overlay = styled(Box)`
  :hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;
const Icon = styled(DeleteSweepOutlinedIcon)`
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: "red" },
      },
    },
  },
  round: {
    borderRadius: "10px",
  },
});
const MintNft = (props) => {
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState(false);
  const [metaData, setMetaData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file.name.match(/\.(jpg|jpeg)$/)) {
      alert("ONLY JPG & JPEG FORMAT FILES ARE SUPPORTED");
      return false;
    } else setSelectedImage(file);
  };

  const handleMetaData = (event) => {
    const { name, value } = event.target;
    setMetaData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const handleclose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  //UPLOAD THE FILE TO IPFS
  const uploadFIle = async () => {
    try {
      const response = await uploadFileToIPFS(selectedImage);
      if (response.success) {
        return response.pinataURL;
      }
    } catch (error) {
      console.log("error in uploading file");
    }
  };
  //upload MetaData to IPFS
  const uploadMeta = async () => {
    const imageURL = await uploadFIle();
    try {
      const { name, description } = metaData;
      const nftJSON = {
        name,
        description,
        image: imageURL,
      };
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success) {
        return response.pinataURL;
      }
    } catch (error) {
      console.log("error in meta data");
    }
  };
  //Mint the NFT //UPLOAD THE HASH TO BLOCKCHAIN 
  const submit = async (event) => {
    event.preventDefault();
    try {
      setOpen(true);
      const metaDataURI = await uploadMeta();
      const price = Web3.utils.toWei(metaData.price, "ether");
      /* const listingPrice = await props.web3.contract.methods
        .listingPrice()
        .call(); */
      /*   const listingAmount = listingPrice.toString(); */
     await props.web3.contract.methods
        .mintToken(metaDataURI, price)
        .send({
          from: props.account,
          value: Web3.utils.toWei("0.01", "ether"),
        });
   
      setTimeout(() => {
        setMetaData({
          name: "",
          description: "",
          price: "",
        });
        setSelectedImage("");
        setOpen(false);
        setOpenSnack(true);
      }, 2000);
    } catch (error) {
      setOpen(false);
      setError(true);
    }
  };

  return (
    <Box>
      <Paper
        elevation={5}
        sx={{
          width: "30%",
          m: "100px auto",
          p: 10,
          borderRadius: "20px",
        }}
      >
        <form onSubmit={submit}>
          <Stack spacing={1}>
            <Typography variant="h6">Create NFT</Typography>
            <Stack spacing={2} direction="column">
              <ThemeProvider theme={theme}>
                <Box
                  component="div"
                  sx={{
                    border: "5px dashed grey",
                    borderRadius: "10px",
                    width: "200px",
                    height: "200px",
                  }}
                >
                  {selectedImage ? (
                    <>
                      <Overlay
                        sx={{
                          position: "absolute",
                          width: "190px",
                          height: "190px",
                          borderRadius: "10px",
                          background: "rgba(0, 0, 0, 0)",
                          transition: "background 0.5s ease",
                        }}
                      >
                        <Icon
                          sx={{
                            position: "absolute",
                            fontSize: "4cm",
                            color: "white",
                            opacity: 0,
                            transition: "opacity 0.5s ease",
                            width: "100%",
                          }}
                          onClick={() => setSelectedImage(null)}
                        />
                      </Overlay>
                      <img
                        className="imgurl"
                        src={URL.createObjectURL(selectedImage)}
                        alt="nft"
                      />
                    </>
                  ) : (
                    <IconButton sx={{ width: "100%" }} disabled>
                      <UploadIcon sx={{ fontSize: "4.5cm" }} />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="caption">
                  File types supported: JPG, JPEG.Max size: 30 MB
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{ width: "25%" }}
                >
                  Upload
                  <input
                    hidden
                    type="file"
                    multiple
                    onChange={handleFile}
                    accept=".jpg,.jpeg"
                    required
                  />
                </Button>
                <TextField
                  name="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  helperText="Name of your NFT"
                  value={metaData.name}
                  onChange={handleMetaData}
                  required
                />
                <TextField
                  name="description"
                  label="Description"
                  type="text"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={metaData.description}
                  onChange={handleMetaData}
                  helperText="The description will be included on the item's detail page underneath its image."
                  required
                />
                <TextField
                  name="price"
                  label="Price"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    endAdornment: (
                      <InputAdornment position="end">ETH</InputAdornment>
                    ),
                  }}
                  error={metaData.price === "[0-9]*"}
                  value={metaData.price}
                  onChange={handleMetaData}
                  helperText="Set a price, for buyers(it should be in ethers)"
                  required
                />
              </ThemeProvider>

              <Button type="submit" variant="contained" sx={{ width: "25%" }}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
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
              Error,Try Again After Sometime!!
            </Alert>
          ) : (
            <Alert
              onClose={handleclose}
              severity="success"
              sx={{ width: "100%" }}
              variant="filled"
            >
              NFT Successfully Created!!!
            </Alert>
          )}
        </Snackbar>
      </Paper>
    </Box>
  );
};
export default MintNft;
