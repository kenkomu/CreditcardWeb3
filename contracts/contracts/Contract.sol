// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web3CreditCard {
    // Structs
    struct CardInfo {
        uint256 cardNumber;
        uint256 expiryTimestamp;
        bool active;
    }

    // State variables
    mapping(address => CardInfo) public cardOwners;
    mapping(address => uint256) public balances;
    mapping(string => uint256) public conversionRates; // Example: "ETH" -> 3000 (ETH to USD)
    uint256 public totalCards;
    address public owner;

    // Events
    event CardIssued(address indexed owner, uint256 cardNumber);
    event PaymentProcessed(address indexed owner, uint256 amount, string currency);

    // Constructor
    constructor(address _owner) {
        owner = _owner;
        totalCards = 0;
    }

    // Issue a new credit card
    function issueCard(uint256 cardNumber, uint256 durationInDays) external {
        uint256 expiryTimestamp = block.timestamp + (durationInDays * 1 days);

        CardInfo memory newCardInfo = CardInfo({
            cardNumber: cardNumber,
            expiryTimestamp: expiryTimestamp,
            active: true
        });

        cardOwners[msg.sender] = newCardInfo;
        totalCards += 1;

        emit CardIssued(msg.sender, cardNumber);
    }

    // Set conversion rate for a specific currency
    function setConversionRate(string memory currency, uint256 rate) external {
        require(msg.sender == owner, "Unauthorized");
        conversionRates[currency] = rate;
    }

    // Process a payment for a specific currency
    function processPayment(string memory currency, uint256 amount) external {
        uint256 rate = conversionRates[currency];
        require(rate > 0, "Invalid currency");

        uint256 fiatAmount = amount * rate;
        uint256 balance = balances[msg.sender];
        require(balance >= fiatAmount, "Insufficient balance");

        balances[msg.sender] -= fiatAmount;

        emit PaymentProcessed(msg.sender, fiatAmount, currency);
    }

    // Check if a card is active
    function isCardActive(address _address) external view returns (bool) {
        CardInfo memory cardInfo = cardOwners[_address];
        return cardInfo.active && block.timestamp < cardInfo.expiryTimestamp;
    }

    // Get the owner of the contract
    function getOwner() external view returns (address) {
        return owner;
    }
}
