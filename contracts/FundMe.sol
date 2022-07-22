// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

//import
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

//Error Codes
error fundMe__NotOwner();

/**
*@title A contract for the fund rising
*@author Talha Rafique
*@notice you can use this contract to rise funding for your project
*@dev very complex contract 
*/ 
contract FundMe {
    //1:type declaration
    using PriceConverter for uint256;


    //2:State variables
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public /* immutable */ i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    //agrigator interface for chainlink
    AggregatorV3Interface public priceFeed;


    //3:Events
    //4:Modifiers
    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert fundMe__NotOwner();
        _;
    }


    //function order
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address  priceFeedAddress) {

        priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
    }
    
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }


    /**
    *@notice this function is used to fund this contract
    *@dev please be very carefull for gettign funding
    */
    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
    

    // function getVersion() public view returns (uint256){
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    //     return priceFeed.version();
    // }
    
    
    
    function withdraw() payable onlyOwner public {
        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()

  

}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly