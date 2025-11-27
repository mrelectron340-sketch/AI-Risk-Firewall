// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScannerAccess
 * @dev Manages access control and pricing for scanner features
 */
contract ScannerAccess {
    struct UserSubscription {
        uint256 freeScansRemaining;
        uint256 premiumScansRemaining;
        uint256 subscriptionEndTime;
        bool isPremium;
        uint256 totalScansUsed;
    }

    struct Pricing {
        uint256 freeScansPerMonth;
        uint256 premiumPricePerMonth; // in wei
        uint256 payPerScanPrice; // in wei
    }

    mapping(address => UserSubscription) public subscriptions;
    Pricing public pricing;
    
    address public owner;
    address public paymentReceiver;
    
    event SubscriptionUpdated(
        address indexed user,
        bool isPremium,
        uint256 freeScansRemaining
    );
    
    event ScanUsed(
        address indexed user,
        bool isPremium,
        uint256 scansRemaining
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _paymentReceiver) {
        owner = msg.sender;
        paymentReceiver = _paymentReceiver;
        
        // Initialize pricing
        pricing = Pricing({
            freeScansPerMonth: 10, // 10 free scans per month
            premiumPricePerMonth: 0.01 ether, // 0.01 MATIC per month
            payPerScanPrice: 0.001 ether // 0.001 MATIC per scan
        });
    }

    /**
     * @dev Check if user can perform a scan
     */
    function canScan(address _user) external view returns (bool) {
        UserSubscription memory sub = subscriptions[_user];
        
        // Reset free scans if new month
        if (sub.subscriptionEndTime < block.timestamp && !sub.isPremium) {
            return true; // Will reset on next use
        }
        
        return sub.freeScansRemaining > 0 || sub.premiumScansRemaining > 0;
    }

    /**
     * @dev Use a scan (called by backend)
     */
    function useScan(address _user) external onlyOwner returns (bool) {
        UserSubscription storage sub = subscriptions[_user];
        
        // Reset free scans if new month
        if (sub.subscriptionEndTime < block.timestamp) {
            if (sub.isPremium && sub.subscriptionEndTime > 0) {
                // Premium expired
                sub.isPremium = false;
            }
            sub.freeScansRemaining = pricing.freeScansPerMonth;
            sub.subscriptionEndTime = block.timestamp + 30 days;
        }
        
        // Use premium scans first, then free scans
        if (sub.premiumScansRemaining > 0) {
            sub.premiumScansRemaining--;
            sub.totalScansUsed++;
            emit ScanUsed(_user, true, sub.premiumScansRemaining);
            return true;
        } else if (sub.freeScansRemaining > 0) {
            sub.freeScansRemaining--;
            sub.totalScansUsed++;
            emit ScanUsed(_user, false, sub.freeScansRemaining);
            return true;
        }
        
        return false;
    }

    /**
     * @dev Subscribe to premium (pay per month)
     */
    function subscribePremium() external payable {
        require(msg.value >= pricing.premiumPricePerMonth, "Insufficient payment");
        
        UserSubscription storage sub = subscriptions[msg.sender];
        
        // Reset if subscription expired
        if (sub.subscriptionEndTime < block.timestamp) {
            sub.freeScansRemaining = pricing.freeScansPerMonth;
        }
        
        sub.isPremium = true;
        sub.premiumScansRemaining = 1000; // Unlimited for premium
        sub.subscriptionEndTime = block.timestamp + 30 days;
        
        // Transfer payment
        (bool success, ) = paymentReceiver.call{value: msg.value}("");
        require(success, "Payment failed");
        
        emit SubscriptionUpdated(msg.sender, true, sub.freeScansRemaining);
    }

    /**
     * @dev Pay for a single scan
     */
    function payPerScan() external payable {
        require(msg.value >= pricing.payPerScanPrice, "Insufficient payment");
        
        UserSubscription storage sub = subscriptions[msg.sender];
        
        // Reset free scans if new month
        if (sub.subscriptionEndTime < block.timestamp) {
            sub.freeScansRemaining = pricing.freeScansPerMonth;
            sub.subscriptionEndTime = block.timestamp + 30 days;
        }
        
        sub.premiumScansRemaining += 1; // Add one premium scan
        
        // Transfer payment
        (bool success, ) = paymentReceiver.call{value: msg.value}("");
        require(success, "Payment failed");
        
        emit SubscriptionUpdated(msg.sender, sub.isPremium, sub.freeScansRemaining);
    }

    /**
     * @dev Get user subscription info
     */
    function getUserSubscription(address _user) 
        external 
        view 
        returns (UserSubscription memory) 
    {
        UserSubscription memory sub = subscriptions[_user];
        
        // Return reset values if subscription expired
        if (sub.subscriptionEndTime < block.timestamp && !sub.isPremium) {
            sub.freeScansRemaining = pricing.freeScansPerMonth;
        }
        
        return sub;
    }

    /**
     * @dev Update pricing (owner only)
     */
    function updatePricing(
        uint256 _freeScansPerMonth,
        uint256 _premiumPricePerMonth,
        uint256 _payPerScanPrice
    ) external onlyOwner {
        pricing.freeScansPerMonth = _freeScansPerMonth;
        pricing.premiumPricePerMonth = _premiumPricePerMonth;
        pricing.payPerScanPrice = _payPerScanPrice;
    }

    /**
     * @dev Set payment receiver address
     */
    function setPaymentReceiver(address _receiver) external onlyOwner {
        paymentReceiver = _receiver;
    }
}

