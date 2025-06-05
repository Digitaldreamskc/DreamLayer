// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./DynamicNFT.sol";

contract DynamicNFTFactory is Ownable {
    address public implementationContract;
    mapping(address => address[]) public userContracts;
    
    event NFTContractDeployed(
        address indexed owner,
        address contractAddress,
        string name,
        string symbol,
        uint256 timestamp
    );

    constructor(address _implementation) {
        implementationContract = _implementation;
    }

    function deployNFTContract(
        string memory name,
        string memory symbol
    ) external returns (address) {
        address clone = Clones.clone(implementationContract);
        DynamicNFT(clone).initialize(msg.sender, name, symbol);
        
        userContracts[msg.sender].push(clone);
        
        emit NFTContractDeployed(
            msg.sender,
            clone,
            name,
            symbol,
            block.timestamp
        );
        
        return clone;
    }

    function getUserContracts(address user) external view returns (address[] memory) {
        return userContracts[user];
    }

    function updateImplementation(address newImplementation) external onlyOwner {
        implementationContract = newImplementation;
    }
}