// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DynamicNFT is ERC721 {
    mapping(uint256 => string) private _tokenURIs;
    
    event TokenURIUpdated(uint256 indexed tokenId, string newTokenURI);

    constructor() ERC721("DynamicNFT", "DNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "DynamicNFT: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public {
        require(_ownerOf(tokenId) != address(0), "DynamicNFT: URI update for nonexistent token");
        _tokenURIs[tokenId] = newTokenURI;
        emit TokenURIUpdated(tokenId, newTokenURI);
    }
}