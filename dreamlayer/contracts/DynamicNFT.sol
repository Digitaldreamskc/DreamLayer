// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@irys/precompile-libraries/libraries/ProgrammableData.sol";

contract DynamicNFT is ERC721URIStorage, ProgrammableData {
    uint256 private _tokenIdCounter;
    mapping(uint256 => bytes) private _tokenData;

    constructor() ERC721("DynamicNFT", "DNFT") {}

    function mint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // Read data from Irys transaction and store it for a specific token
    function updateTokenData(uint256 tokenId, bytes32 transactionId, uint256 startOffset, uint256 length) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        // Create access list for reading data
        (bool success, bytes memory data) = readBytes();
        require(success, "Failed to read data from Irys");

        // Store the data
        _tokenData[tokenId] = data;
    }

    // Get stored data for a token
    function getTokenData(uint256 tokenId) public view returns (bytes memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenData[tokenId];
    }

    // Check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
} 