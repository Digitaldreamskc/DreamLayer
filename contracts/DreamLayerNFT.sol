// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DreamLayerNFT is ERC721, ERC721URIStorage, Ownable {
    // Token ID counter
    uint256 private _nextTokenId;
    
    // Mapping to track token creators
    mapping(uint256 => address) public creators;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string uri);
    event MetadataUpdated(uint256 indexed tokenId, string newUri);

    constructor() ERC721("DreamLayer", "DREAM") Ownable(msg.sender) {}

    function mint(string memory uri, address creator) public returns (uint256) {
        require(creator != address(0), "Invalid creator address");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(creator, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Record creator
        creators[tokenId] = creator;
        
        emit NFTMinted(tokenId, creator, uri);
        return tokenId;
    }
    
    function updateTokenURI(uint256 tokenId, string memory newUri) public {
        if (_ownerOf(tokenId) == address(0)) revert("Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender || 
            creators[tokenId] == msg.sender || 
            owner() == msg.sender,
            "Not authorized to update metadata"
        );
        
        _setTokenURI(tokenId, newUri);
        emit MetadataUpdated(tokenId, newUri);
    }
    
    function getCreator(uint256 tokenId) public view returns (address) {
        if (_ownerOf(tokenId) == address(0)) revert("Token does not exist");
        return creators[tokenId];
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}