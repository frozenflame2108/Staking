pragma solidity ^0.5.0;

import "./OhmToken.sol";
import "./DaiToken.sol";

contract Staking {
    string public name = "Ohm Token Farm";
    address public owner;
    OhmToken public ohmToken;
    DaiToken public daiToken;

    address[] public clients;
    mapping(address => uint) public investingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(OhmToken _ohmToken, DaiToken _daiToken) public {
        ohmToken = _ohmToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function Deposite(uint _amount) public {

        require(_amount > 0, "amount cannot be 0");


        daiToken.transferFrom(msg.sender, address(this), _amount);


        investingBalance[msg.sender] = investingBalance[msg.sender] + _amount;


        if(!hasStaked[msg.sender]) {
            clients.push(msg.sender);
        }


        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }


    function Withdraw() public {

        uint balance = investingBalance[msg.sender];


        require(balance > 0, "staking balance cannot be 0");


        daiToken.transfer(msg.sender, balance);

 
        investingBalance[msg.sender] = 0;

  
        isStaking[msg.sender] = false;
    }


    function issue() public {
 
        require(msg.sender == owner, "caller must be the owner");


        for (uint i=0; i<clients.length; i++) {
            address recipient = clients[i];
            uint balance = investingBalance[recipient];
            if(balance > 0) {
                ohmToken.transfer(recipient, balance);
            }
        }
    }
}
