// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RiskRegistry
 * @dev On-chain registry for logging detected scams and risks
 */
contract RiskRegistry {
    struct RiskLog {
        address reporter;
        address contractAddress;
        uint8 riskScore; // 0-100
        uint256 timestamp;
        string threatType;
        bool verified;
    }

    struct RiskStats {
        uint256 totalReports;
        uint256 verifiedReports;
        uint8 averageRiskScore;
    }

    mapping(address => RiskLog[]) public riskLogs;
    mapping(address => RiskStats) public contractStats;
    mapping(address => bool) public verifiedScams;
    
    address public owner;
    uint256 public totalReports;
    
    event RiskReported(
        address indexed reporter,
        address indexed contractAddress,
        uint8 riskScore,
        string threatType,
        uint256 timestamp
    );
    
    event RiskVerified(
        address indexed contractAddress,
        bool isScam
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Report a risky contract or address
     */
    function reportRisk(
        address _contractAddress,
        uint8 _riskScore,
        string memory _threatType
    ) external {
        require(_riskScore <= 100, "Invalid risk score");
        require(bytes(_threatType).length > 0, "Threat type required");
        
        RiskLog memory newLog = RiskLog({
            reporter: msg.sender,
            contractAddress: _contractAddress,
            riskScore: _riskScore,
            timestamp: block.timestamp,
            threatType: _threatType,
            verified: false
        });
        
        riskLogs[_contractAddress].push(newLog);
        
        RiskStats storage stats = contractStats[_contractAddress];
        stats.totalReports++;
        
        // Update average risk score
        uint256 totalScore = stats.averageRiskScore * (stats.totalReports - 1) + _riskScore;
        stats.averageRiskScore = uint8(totalScore / stats.totalReports);
        
        totalReports++;
        
        emit RiskReported(
            msg.sender,
            _contractAddress,
            _riskScore,
            _threatType,
            block.timestamp
        );
    }

    /**
     * @dev Get risk logs for a contract
     */
    function getRiskLogs(address _contractAddress) 
        external 
        view 
        returns (RiskLog[] memory) 
    {
        return riskLogs[_contractAddress];
    }

    /**
     * @dev Get risk statistics for a contract
     */
    function getRiskStats(address _contractAddress) 
        external 
        view 
        returns (RiskStats memory) 
    {
        return contractStats[_contractAddress];
    }

    /**
     * @dev Check if an address is flagged as a verified scam
     */
    function isVerifiedScam(address _contractAddress) 
        external 
        view 
        returns (bool) 
    {
        return verifiedScams[_contractAddress];
    }

    /**
     * @dev Verify a contract as a scam (owner only)
     */
    function verifyScam(address _contractAddress, bool _isScam) 
        external 
        onlyOwner 
    {
        verifiedScams[_contractAddress] = _isScam;
        
        RiskStats storage stats = contractStats[_contractAddress];
        if (_isScam) {
            stats.verifiedReports++;
        }
        
        emit RiskVerified(_contractAddress, _isScam);
    }

    /**
     * @dev Get total number of reports
     */
    function getTotalReports() external view returns (uint256) {
        return totalReports;
    }
}

