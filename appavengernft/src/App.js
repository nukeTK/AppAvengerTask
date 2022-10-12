import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "./artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import detectEthereumProvider from "@metamask/detect-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Store from "./components/Store";
import MintNft from "./components/MintNft";
import BuyPage from "./components/BuyPage";
import MyProfile from "./components/MyProfile";

const contractAddress = "0xbfC6AaD4210A74489FdBf35f99A1DA41018C50c2";

const App = () => {
  const [web3, setWeb3] = useState({
    provider: "",
    contract: "",
  });
  const [account, setAccount] = useState("");
  //CONNECT TO METMASK FUNCTION
  const getProvider = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const _provider = await detectEthereumProvider();
    if (_provider) {
      await _provider.request({ method: "eth_requestAccounts" });
      const account = await web3.eth.requestAccounts();
      const _contract = new web3.eth.Contract(contractABI.abi, contractAddress);
      setWeb3({
        provider: _provider,
        contract: _contract,
      });
      setAccount(account[0]);
    }
  };
  //CHECK FOR THE WALLET ADDRESS CHANGE
  useEffect(() => {
    window.ethereum.on("accountsChanged", async (acc) => {
      if (acc.length === 0) console.log("please connect to accounts");
      else if (acc[0] !== account) setAccount(acc[0]);
    });
  }, [account]);

  //AUTOMATICALLY SYNC WITH THE WALLET IF THE WALLET ADDRESS CHANGES AND POP UP FOR SIGN IN IF METAMASK WALLET EXTENSION INSTALLED
  useEffect(()=>{
    getProvider();
  },[account])
  
  return (
    <BrowserRouter >
      <NavBar account={account} getProvider={getProvider}/>
      <Routes>
        <Route path="" element={<Store web3={web3} account={account}/>} />
        <Route
          path="/Mint-nft"
          element={<MintNft web3={web3} account={account} />}
        />
        <Route
          path="/Buy-nft"
          element={<BuyPage web3={web3} account={account} />}
        />
        <Route
          path="/my-profile"
          element={<MyProfile web3={web3} account={account} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
