// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SafetyNFT
 * @dev Soulbound Token (SBT) representing user's safety reputation
 * Non-transferable NFT that tracks user's security score
 */
contract SafetyNFT is ERC721URIStorage, Ownable {
    struct SafetyProfile {
        uint8 trustScore; // 0-100
        uint256 scamsAvoided;
        uint256 safeTransactions;
        uint256 lastUpdated;
        string tier; // bronze, silver, gold, platinum
    }

    mapping(address => uint256) public walletToTokenId;
    mapping(uint256 => SafetyProfile) public safetyProfiles;
    mapping(address => bool) public hasMinted;
    
    uint256 private _tokenIdCounter;
    address public riskRegistry;
    
    event SafetyProfileUpdated(
        address indexed wallet,
        uint256 indexed tokenId,
        uint8 trustScore,
        uint256 scamsAvoided
    );

    modifier onlyRegistry() {
        require(msg.sender == riskRegistry || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor(address initialOwner) ERC721("AI Risk Firewall Safety NFT", "SAFETY") Ownable(initialOwner) {
        _tokenIdCounter = 1;
    }

    /**
     * @dev Set the RiskRegistry contract address
     */
    function setRiskRegistry(address _registry) external onlyOwner {
        riskRegistry = _registry;
    }

    /**
     * @dev Mint a new Safety NFT for a wallet (one per wallet)
     */
    function mintSafetyNFT(address _wallet) external onlyRegistry returns (uint256) {
        require(!hasMinted[_wallet], "NFT already minted");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(_wallet, tokenId);
        
        walletToTokenId[_wallet] = tokenId;
        hasMinted[_wallet] = true;
        
        safetyProfiles[tokenId] = SafetyProfile({
            trustScore: 50, // Starting score
            scamsAvoided: 0,
            safeTransactions: 0,
            lastUpdated: block.timestamp,
            tier: "bronze"
        });
        
        return tokenId;
    }

    /**
     * @dev Update safety profile (called by RiskRegistry)
     */
    function updateSafetyProfile(
        address _wallet,
        uint8 _trustScore,
        uint256 _scamsAvoided,
        uint256 _safeTransactions
    ) external onlyRegistry {
        uint256 tokenId = walletToTokenId[_wallet];
        require(tokenId > 0, "NFT not minted");
        
        SafetyProfile storage profile = safetyProfiles[tokenId];
        profile.trustScore = _trustScore;
        profile.scamsAvoided = _scamsAvoided;
        profile.safeTransactions = _safeTransactions;
        profile.lastUpdated = block.timestamp;
        
        // Update tier based on trust score
        if (_trustScore >= 90) {
            profile.tier = "platinum";
        } else if (_trustScore >= 75) {
            profile.tier = "gold";
        } else if (_trustScore >= 60) {
            profile.tier = "silver";
        } else {
            profile.tier = "bronze";
        }
        
        emit SafetyProfileUpdated(_wallet, tokenId, _trustScore, _scamsAvoided);
    }

    /**
     * @dev Get safety profile for a wallet
     */
    function getSafetyProfile(address _wallet) 
        external 
        view 
        returns (SafetyProfile memory) 
    {
        uint256 tokenId = walletToTokenId[_wallet];
        require(tokenId > 0, "NFT not minted");
        return safetyProfiles[tokenId];
    }

    /**
     * @dev Override transfer functions to make it soulbound (non-transferable)
     * In OpenZeppelin v5, we override _update instead of _transfer
     */
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        virtual 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        // Only allow minting (from == address(0)) or burning (to == address(0))
        require(from == address(0) || to == address(0), "Soulbound: Cannot transfer");
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Check if wallet has minted NFT
     */
    function hasSafetyNFT(address _wallet) external view returns (bool) {
        return hasMinted[_wallet];
    }
}
