import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Web3 from "web3";

const MyProfile = (props) => {
  const [myNfts, setMyTotalNfts] = useState();
  const [tokenArray, setTokenArray] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const allToken = await props.web3.contract.methods.getMyNfts().call({
        from: props.account,
      });
      setMyTotalNfts(allToken);
      console.log(allToken);
    };
    props.web3.contract && getData();
  }, [props.web3.contract,props.account]);

  useEffect(() => {
    const data = async () => {
      let arrayNft = [];
      for (let i = 0; i < myNfts.length; i++) {
        let tokenURI = await props.web3.contract.methods
          .tokenURI(myNfts[i].tokenId)
          .call();
        let meta = await axios.get(tokenURI);

        let item = {
          tokenId: myNfts[i].tokenId,
          seller: myNfts[i].owner,
          owner: myNfts[i].seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          price: Web3.utils.fromWei(myNfts[i].price.toString(), "ether"),
        };
        arrayNft.push(item);
      }
      setTokenArray(arrayNft);
    };
    myNfts && data();
  }, [props.web3.contract, myNfts]);

  return (
    <Box sx={{ margin: "100px" }}>
      <Grid container direction="row" spacing={1}>
        {tokenArray.length !== 0 ? (
          tokenArray.map((item, index) => (
            <Grid key={index} item sx={{ ml: "5px" }}>
              <Card
                elevation={3}
                sx={{ width: 300, height: 450, borderRadius: "20px" }}
              >
                <CardMedia
                  component="img"
                  alt="nft"
                  height="300"
                  image={item.image}
                  sx={{
                    objectFit: "cover",
                    objectPosition: "top",
                    transition: "0.4s ease",
                    borderStartStartRadius: "20px",
                    "&:hover": {
                      transform: "scale(1.10)",
                      cursor: "pointer",
                    },
                  }}
                />
                <Divider />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    {item.description.substring(0, 100)}...etc.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Paper
                    elevation={1}
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      height: "35px",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography variant="body1" p={1}>
                      Price:{item.price} ETH
                    </Typography>
                  </Paper>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Paper elevation={5} sx={{ p: "10px", borderRadius: "10px" }}>
            <Typography variant="h1">No NFT Minted Yet!!</Typography>
          </Paper>
        )}
      </Grid>
    </Box>
  );
};

export default MyProfile;
