const main = async () => {
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const deployNFTMarketplace = await NFTMarketplace.deploy();
  await deployNFTMarketplace.deployed();
  console.log("Contract Address:", deployNFTMarketplace.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
