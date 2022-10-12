//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    struct ListedItems {
        // Token Detail
        uint256 tokenId;
        address payable owner;
        address payable seller;
        address payable firstOwner;
        uint256 price;
        uint256 sellCount;
    }
    address payable admin;
    uint256 public lisitingPrice = 0.01 ether;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    mapping(uint256 => ListedItems) private itemDetails;

    constructor() ERC721("APPAVENGER", "AA") {
        admin = payable(msg.sender);
    }
    //Minting Token function , taking IPFS hash and price set by the user
    function mintToken(string memory _tokenURI, uint256 _price)
        public
        payable
        returns (uint256)
    {
        require(
            msg.value == lisitingPrice,
            "Not enough Ether to mint the token"
        );
        _tokenId.increment();
        uint256 tokenId = _tokenId.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenDetail(tokenId, _price);
        return tokenId;
    }

    function tokenDetail(uint256 tokenId, uint256 _price) private {
        itemDetails[tokenId] = ListedItems(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            payable(msg.sender),
            _price,
            0
        );
        _transfer(msg.sender, address(this), tokenId);
    }

    // Get all the nft minted by all the users
    function getAllNfts() public view returns (ListedItems[] memory) {
        uint256 totalToken = _tokenId.current();
        ListedItems[] memory token = new ListedItems[](totalToken);
        uint256 currentToken = 0;
        for (uint256 i = 0; i < totalToken; i++) {
            uint256 currentId = i + 1;
            ListedItems storage item = itemDetails[currentId];
            token[currentToken] = item;
            currentToken += 1;
        }
        return token;
    }

    //Get all the nft minted by the single user for the profile
    function getMyNfts() public view returns (ListedItems[] memory) {
        uint256 totalToken = _tokenId.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalToken; i++) {
            if (
                itemDetails[i + 1].owner == msg.sender ||
                itemDetails[i + 1].seller == msg.sender
            ) {
                itemCount = i + 1;
            }
        }
        ListedItems[] memory token = new ListedItems[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                itemDetails[i + 1].owner == msg.sender ||
                itemDetails[i + 1].seller == msg.sender
            ) {
                uint256 currentId = i + 1;
                ListedItems storage item = itemDetails[currentId];
                token[currentIndex] = item;
                currentIndex += 1;
            }
        }
        return token;
    }

    //Buy NFT function, with royality fee transfer to the owner who minted the NFT
    function executeSell(uint256 tokenId) public payable {
        uint256 _price = itemDetails[tokenId].price;
        uint256 _royalityfee = (_price * 25) / 100;
        address _seller = itemDetails[tokenId].seller;
        address _firstOwner = itemDetails[tokenId].firstOwner;
        uint256 totalFee = _price + lisitingPrice;
        require(totalFee == msg.value, "Not enough Ether to buy NFT");
        _price = _price - _royalityfee;
        itemDetails[tokenId].seller = payable(msg.sender);
        payable(admin).transfer(lisitingPrice);
        payable(_seller).transfer(_price);
        payable(_firstOwner).transfer(_royalityfee);
        if (itemDetails[tokenId].sellCount != 0) {
            _transfer(_seller, msg.sender, tokenId);
        } else {
            _transfer(address(this), msg.sender, tokenId);
        }
        approve(address(this), tokenId); //Approval for the marketplace to sell token on your behalf
        itemDetails[tokenId].sellCount += 1;
    }
}
