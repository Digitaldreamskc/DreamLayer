// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract DynamicNFT is 
    Initializable, 
    ERC721Upgradeable, 
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable 
{
    // State variables
    mapping(uint256 => string) private _tokenURIs;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    // Events
    event TokenURIUpdated(uint256 indexed tokenId, string newTokenURI);
    event BaseURIUpdated(string newBaseURI);
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init(initialOwner);
        __ReentrancyGuard_init();
    }

    /**
     * @dev Mints a new token with dynamic metadata
     * @param to The address that will own the minted token
     * @param tokenURI URI for the token's metadata
     * @return tokenId The ID of the newly minted token
     */
    function mint(
        address to,
        string memory tokenURI
    ) external onlyOwner nonReentrant returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(to, tokenId, tokenURI);
        
        _tokenIdCounter++;
        return tokenId;
    }

    /**
     * @dev Updates the token URI for an existing token
     * @param tokenId The ID of the token to update
     * @param newTokenURI The new URI for the token's metadata
     */
    function updateTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) external nonReentrant {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender || owner() == msg.sender,
            "Not authorized"
        );
        
        _setTokenURI(tokenId, newTokenURI);
        emit TokenURIUpdated(tokenId, newTokenURI);
    }

    /**
     * @dev Sets the base URI for all tokens
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Internal function to set the token URI
     * @param tokenId The ID of the token
     * @param uri The URI to set
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_exists(tokenId), "URI set for nonexistent token");
        _tokenURIs[tokenId] = uri;
    }

    /**
     * @dev Returns the total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the URI for a given token ID
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        string memory baseURI = _baseURI();
        string memory _tokenURI = _tokenURIs[tokenId];

        if (bytes(baseURI).length == 0) {
            return _tokenURI;
        }

        return string(abi.encodePacked(baseURI, _tokenURI));
    }

    /**
     * @dev Checks if the contract supports an interface
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}