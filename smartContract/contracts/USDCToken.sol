// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDCToken is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 100000000 ether);
    }

    function getUsdc() external {
        _mint(msg.sender, 900000 ether);
    }
}
