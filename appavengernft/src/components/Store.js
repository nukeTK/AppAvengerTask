import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import { Link } from "react-router-dom";
import Web3 from "web3";

const Store = (props) => {
    const [totalNfts, setTotalNfts] = useState("");
    const [tokenArray, setTokenArray] = useState([]);

    //CHECK FOR THE CONTARCT IF AVAILABLE THEN ONLY GET ALL THE NFT FROM THE BLOCKCHAIN
    useEffect(() => {
      const getData = async () => {
        const allToken = await props.web3.contract.methods.getAllNfts().call();
        setTotalNfts(allToken);
      };
      props.web3.contract && getData();
    }, [props.web3.contract]);
  
    //IT RUNS WHEN TOKEN GET BY THE ABOVE USE EFFECT ELSE IT WONT RUN
    useEffect(() => {
      const data = async () => {
        let arrayNft = [];
        for (let i = 0; i < totalNfts.length; i++) {
          let tokenURI = await props.web3.contract.methods.tokenURI(
            totalNfts[i].tokenId
          ).call();
          let meta = await axios.get(tokenURI);
          let item = {
            tokenId: totalNfts[i].tokenId,
            seller: totalNfts[i].owner,
            owner: totalNfts[i].seller,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            price: Web3.utils.fromWei(totalNfts[i].price,"ether"),
          };
          arrayNft.push(item);
        }
        setTokenArray(arrayNft);
      };
      totalNfts && data();
    }, [props.web3.contract, totalNfts]);

  return (
    <Box sx={{margin:"200px"}} >
       <Grid container direction="row" spacing={1}>
        { tokenArray ? tokenArray.map((item,index)=>
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
                      <Link
                        to="/Buy-nft"
                        state={{ data: item }}
                        style={{ textDecoration: "none", marginLeft: "auto" }}
                      >
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                          sx={{ borderRadius: "10px" }}
                        >
                          Buy
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                  </Grid>):<Typography variant="h4">
                    No NFT Minted Yet!!! </Typography>}
       </Grid>
       {!props.account && <Typography variant="h4" sx={{fontFamily:"fantasy"}}>Connect To Metamask</Typography> }
       {tokenArray.length === 0 && <Typography variant="h4" sx={{fontFamily:"fantasy"}}>No NFT Listed</Typography> }

    </Box>
  )
}

export default Store;