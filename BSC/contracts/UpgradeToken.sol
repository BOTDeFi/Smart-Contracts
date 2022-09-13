/************************************************************
 *
 * Autor: BotPlanet
 *
 * 446576656c6f7065723a20416e746f6e20506f6c656e79616b61 ****/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UpgradeToken is Ownable {

    // Usings

    using SafeERC20 for IERC20;

    // Constrants

    address private constant DEAD_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    // Properties

    IERC20 public oldToken;
    IERC20 public newToken;
    bool public stopped = false;

    // Events
    event TokensUpdated(address account, uint256 amount);
    event WithdrawedExtraTokens(uint256 amount);

    // Constructors

    constructor(address oldToken_, address newToken_) {
        oldToken = IERC20(oldToken_);
        newToken = IERC20(newToken_);
    }

    // Methods

    function upgrade() external {
        require(!stopped, "UpgradeToken: contract is stopped");
        uint256 amountToUpgrade = oldToken.balanceOf(msg.sender);
        require(amountToUpgrade > 0, "UpgradeToken: amount to upgrade is zero");
        // Check allowed tokens to burn
        uint256 allowed = oldToken.allowance(msg.sender, address(this));
        require(
            allowed >= amountToUpgrade,
            "UpgradeToken: amount to upgrade is greater allowed amount"
        );
        // Check balance if is possible to transfer new tokens to caller
        uint256 balanceNewTokens = newToken.balanceOf(address(this));
        require(
            balanceNewTokens > 0 && balanceNewTokens >= amountToUpgrade,
            "UpgradeToken: low balance of new tokens in the contract"
        );
        // Burn old tokens
        oldToken.safeTransferFrom(msg.sender, DEAD_ADDRESS, amountToUpgrade);
        // Transfer new tokens
        newToken.safeTransfer(msg.sender, amountToUpgrade);

        emit TokensUpdated(msg.sender, amountToUpgrade);
    }

    function stop() external onlyOwner {
        require(stopped, "UpgradeToken: already stopped");
        stopped = true;
    }

    function resume() external onlyOwner {
        require(!stopped, "UpgradeToken: is not stopped");
        stopped = false;
    }

    function withdraw() external onlyOwner {
        uint256 balanceNewTokens = newToken.balanceOf(address(this));
        require(balanceNewTokens > 0, "UpgradeToken: no tokens to withdraw");
        newToken.safeTransfer(owner(), balanceNewTokens);

        emit WithdrawedExtraTokens(balanceNewTokens);
    }
}
