/************************************************************
 * 
 * Autor: BotPlanet
 *
 * 446576656c6f7065723a20416e746f6e20506f6c656e79616b61 ****/

// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

interface IERC20 {

    function totalSupply() external view returns (uint256);

    /**
        * @dev Returns the amount of tokens owned by `account`.
        */
    function balanceOf(address account) external view returns (uint256);

    /**
        * @dev Moves `amount` tokens from the caller's account to `recipient`.
        *
        * Returns a boolean value indicating whether the operation succeeded.
        *
        * Emits a {Transfer} event.
        */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
        * @dev Returns the remaining number of tokens that `spender` will be
        * allowed to spend on behalf of `owner` through {transferFrom}. This is
        * zero by default.
        *
        * This value changes when {approve} or {transferFrom} are called.
        */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
        * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
        *
        * Returns a boolean value indicating whether the operation succeeded.
        *
        * IMPORTANT: Beware that changing an allowance with this method brings the risk
        * that someone may use both the old and the new allowance by unfortunate
        * transaction ordering. One possible solution to mitigate this race
        * condition is to first reduce the spender's allowance to 0 and set the
        * desired value afterwards:
        * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
        *
        * Emits an {Approval} event.
        */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
        * @dev Moves `amount` tokens from `sender` to `recipient` using the
        * allowance mechanism. `amount` is then deducted from the caller's
        * allowance.
        *
        * Returns a boolean value indicating whether the operation succeeded.
        *
        * Emits a {Transfer} event.
        */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
        * @dev Emitted when `value` tokens are moved from one account (`from`) to
        * another (`to`).
        *
        * Note that `value` may be zero.
        */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
        * @dev Emitted when the allowance of a `spender` for an `owner` is set by
        * a call to {approve}. `value` is the new allowance.
        */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


/**
    * @dev Wrappers over Solidity's arithmetic operations with added overflow
    * checks.
    *
    * Arithmetic operations in Solidity wrap on overflow. This can easily result
    * in bugs, because programmers usually assume that an overflow raises an
    * error, which is the standard behavior in high level programming languages.
    * `SafeMath` restores this intuition by reverting the transaction when an
    * operation overflows.
    *
    * Using this library instead of the unchecked operations eliminates an entire
    * class of bugs, so it's recommended to use it always.
    */
    
library SafeMath {
    /**
        * @dev Returns the addition of two unsigned integers, reverting on
        * overflow.
        *
        * Counterpart to Solidity's `+` operator.
        *
        * Requirements:
        *
        * - Addition cannot overflow.
        */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
        * @dev Returns the subtraction of two unsigned integers, reverting on
        * overflow (when the result is negative).
        *
        * Counterpart to Solidity's `-` operator.
        *
        * Requirements:
        *
        * - Subtraction cannot overflow.
        */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
        * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
        * overflow (when the result is negative).
        *
        * Counterpart to Solidity's `-` operator.
        *
        * Requirements:
        *
        * - Subtraction cannot overflow.
        */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
        * @dev Returns the multiplication of two unsigned integers, reverting on
        * overflow.
        *
        * Counterpart to Solidity's `*` operator.
        *
        * Requirements:
        *
        * - Multiplication cannot overflow.
        */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
        * @dev Returns the integer division of two unsigned integers. Reverts on
        * division by zero. The result is rounded towards zero.
        *
        * Counterpart to Solidity's `/` operator. Note: this function uses a
        * `revert` opcode (which leaves remaining gas untouched) while Solidity
        * uses an invalid opcode to revert (consuming all remaining gas).
        *
        * Requirements:
        *
        * - The divisor cannot be zero.
        */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
        * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
        * division by zero. The result is rounded towards zero.
        *
        * Counterpart to Solidity's `/` operator. Note: this function uses a
        * `revert` opcode (which leaves remaining gas untouched) while Solidity
        * uses an invalid opcode to revert (consuming all remaining gas).
        *
        * Requirements:
        *
        * - The divisor cannot be zero.
        */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
        * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
        * Reverts when dividing by zero.
        *
        * Counterpart to Solidity's `%` operator. This function uses a `revert`
        * opcode (which leaves remaining gas untouched) while Solidity uses an
        * invalid opcode to revert (consuming all remaining gas).
        *
        * Requirements:
        *
        * - The divisor cannot be zero.
        */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
        * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
        * Reverts with custom message when dividing by zero.
        *
        * Counterpart to Solidity's `%` operator. This function uses a `revert`
        * opcode (which leaves remaining gas untouched) while Solidity uses an
        * invalid opcode to revert (consuming all remaining gas).
        *
        * Requirements:
        *
        * - The divisor cannot be zero.
        */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return payable(address(msg.sender));
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


/**
    * @dev Collection of functions related to the address type
    */
library Address {
    /**
        * @dev Returns true if `account` is a contract.
        *
        * [IMPORTANT]
        * ====
        * It is unsafe to assume that an address for which this function returns
        * false is an externally-owned account (EOA) and not a contract.
        *
        * Among others, `isContract` will return false for the following
        * types of addresses:
        *
        *  - an externally-owned account
        *  - a contract in construction
        *  - an address where a contract will be created
        *  - an address where a contract lived, but was destroyed
        * ====
        */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
        * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
        * `recipient`, forwarding all available gas and reverting on errors.
        *
        * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
        * of certain opcodes, possibly making contracts go over the 2300 gas limit
        * imposed by `transfer`, making them unable to receive funds via
        * `transfer`. {sendValue} removes this limitation.
        *
        * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
        *
        * IMPORTANT: because control is transferred to `recipient`, care must be
        * taken to not create reentrancy vulnerabilities. Consider using
        * {ReentrancyGuard} or the
        * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
        */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
        * @dev Performs a Solidity function call using a low level `call`. A
        * plain`call` is an unsafe replacement for a function call: use this
        * function instead.
        *
        * If `target` reverts with a revert reason, it is bubbled up by this
        * function (like regular Solidity function calls).
        *
        * Returns the raw returned data. To convert to the expected return value,
        * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
        *
        * Requirements:
        *
        * - `target` must be a contract.
        * - calling `target` with `data` must not revert.
        *
        * _Available since v3.1._
        */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
        * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
        * `errorMessage` as a fallback revert reason when `target` reverts.
        *
        * _Available since v3.1._
        */
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
        * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
        * but also transferring `value` wei to `target`.
        *
        * Requirements:
        *
        * - the calling contract must have an ETH balance of at least `value`.
        * - the called Solidity function must be `payable`.
        *
        * _Available since v3.1._
        */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
        * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
        * with `errorMessage` as a fallback revert reason when `target` reverts.
        *
        * _Available since v3.1._
        */
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        return _functionCallWithValue(target, data, value, errorMessage);
    }

    function _functionCallWithValue(address target, bytes memory data, uint256 weiValue, string memory errorMessage) private returns (bytes memory) {
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: weiValue }(data);
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}
/**
    * @title SafeERC20
    * @dev Wrappers around ERC20 operations that throw on failure (when the token
    * contract returns false). Tokens that return no value (and instead revert or
    * throw on failure) are also supported, non-reverting calls are assumed to be
    * successful.
    * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
    * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
    */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
        * @dev Deprecated. This function has issues similar to the ones found in
        * {IERC20-approve}, and its usage is discouraged.
        *
        * Whenever possible, use {safeIncreaseAllowance} and
        * {safeDecreaseAllowance} instead.
        */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
        * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
        * on the return value: the return value is optional (but if data is returned, it must not be false).
        * @param token The token targeted by the call.
        * @param data The call data (encoded using abi.encode or one of its variants).
        */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

/**
    * @dev Contract module which provides a basic access control mechanism, where
    * there is an account (an owner) that can be granted exclusive access to
    * specific functions.
    *
    * By default, the owner account will be the one that deploys the contract. This
    * can later be changed with {transferOwnership}.
    *
    * This module is used through inheritance. It will make available the modifier
    * `onlyOwner`, which can be applied to your functions to restrict their use to
    * the owner.
    */
abstract contract Ownable is Context {
    address private _owner;
    address private _previousOwner;
    uint256 private _lockTime;
    bool private _isOwnershipRenounced = false;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event NewDelay(uint256 indexed newDelay);

    /**
        * @dev Initializes the contract setting the deployer as the initial owner.
        */
    constructor ()  {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
        * @dev Returns the address of the current owner.
        */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
        * @dev Throws if called by any account other than the owner.
        */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

        /**
        * @dev Leaves the contract without owner. It will not be possible to call
        * `onlyOwner` functions anymore. Can only be called by the current owner.
        *
        * NOTE: Renouncing ownership will leave the contract without an owner,
        * thereby removing any functionality that is only available to the owner.
        */
    function renounceOwnership() public virtual onlyOwner {
        _owner = address(0);
        _isOwnershipRenounced = true;
        emit OwnershipTransferred(_owner, address(0));
    }

    /**
        * @dev Transfers ownership of the contract to a new account (`newOwner`).
        * Can only be called by the current owner.
        */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function geUnlockTime() public view returns (uint256) {
        return _lockTime;
    }

    //Locks the contract for owner for the amount of time provided
    function lock(uint256 time) public virtual onlyOwner {
        _previousOwner = _owner;
        _owner = address(0);
        _lockTime = block.timestamp + time;
        emit OwnershipTransferred(_owner, address(0));
        emit NewDelay(_lockTime);
    }
    
    //Unlocks the contract for owner when _lockTime is exceeds
    function unlock() public virtual {
        require(_isOwnershipRenounced == false, "Ownership of the contract has been relinquished");
        require(_previousOwner == msg.sender, "You don't have permission to unlock the token contract");
        require(block.timestamp > _lockTime , "Contract is locked until 7 days");
        _owner = _previousOwner;
        emit OwnershipTransferred(_owner, _previousOwner);
    }
}

interface IPancakeFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface IPancakeRouter01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IPancakeRouter02 is IPancakeRouter01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract BotTokenV1 is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;
    using SafeERC20 for IERC20;
    
    address private _dead = 0x000000000000000000000000000000000000dEaD;
    
    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) private _isExcludedFromFee;

    uint256 private constant MAX = ~uint256(0);
    uint256 public _totalSupply;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;
    
    string public _name;
    string public _symbol;
    uint8 private _decimals;
    
    uint8 public taxFee;
    uint8 private _previousTaxFee = taxFee;
    
    uint8 public liquidityFee;
    uint8 private _previousLiquidityFee = liquidityFee;

    uint8 public burnFee;
    uint8 private _previousBurnFee = burnFee;

    uint8 public walletFee;
    uint8 private _previousWalletFee = walletFee;

    uint8 public buybackFee;
    uint8 private _previousBuybackFee = buybackFee;

    IPancakeRouter02 public pcsV2Router;
    address public pcsV2Pair;
    address payable public feeWallet;

    address public router = 0x10ED43C718714eb63d5aA57B78B54704E256024E; // BSC
    //address public router = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1; // BSC TestNet
    
    bool private _inSwapAndLiquify;
    bool public swapAndLiquifyEnabled;
    
    uint8 public minMxTxPercentage = 1;
    uint256 public maxTxAmount;
    uint8 public minMxWalletPercentage = 1;
    uint256 public maxWalletAmount;
    uint256 public numTokensSellToAddToLiquidity;    
    uint256 private _buyBackUpperLimit;
	uint256 private _buyBackMinLimit;
    
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(uint256 tokensSwapped, uint256 ethReceived, uint256 tokensIntoLiqudity);

    modifier lockTheSwap {
        _inSwapAndLiquify = true;
        _;
        _inSwapAndLiquify = false;
    }
    
    constructor () {
        // Initialization. Start
        address tokenOwner = msg.sender; // address(0xe919621cae4bE24eb2cA43E5D077816690D96767);
        feeWallet = payable(0xe919621cae4bE24eb2cA43E5D077816690D96767);

        _name = "BOT"; // Token name
        _symbol = "BOT"; // Token symbol
        _decimals = 18;
        _totalSupply = uint256(1000000000 * 10**_decimals);
        
        uint8 setMxTxPer = 100;
        uint8 setMxWalletPer = 1;
        
        taxFee = 0; // 0%
        liquidityFee = 0; // 0%
        burnFee = 1; // 1%
        walletFee = 0; // 0%
        buybackFee = 1; // 1%
        
        _buyBackUpperLimit = 10 * 10**_decimals;
		_buyBackMinLimit = 10 * 10**_decimals;

        swapAndLiquifyEnabled = true;
        // Initialization. End

        _rTotal = (MAX - (MAX % _totalSupply));        
        _rOwned[tokenOwner] = _rTotal;
        _setMaxTxPercent(setMxTxPer);
        _setMaxWalletPercent(setMxWalletPer);
        numTokensSellToAddToLiquidity = _totalSupply.mul(1).div(1000);        
        
        // Create a PancakeSwap pair for this new token
        // IPancakeRouter02 _pcsV2Router = IPancakeRouter02(router);
        // pcsV2Pair = IPancakeFactory(_pcsV2Router.factory()).createPair(address(this), _pcsV2Router.WETH());
        // pcsV2Router = _pcsV2Router;
        
        // Exclude owner and contract address from fee
        _isExcludedFromFee[tokenOwner] = true;
        _isExcludedFromFee[address(this)] = true;

        // Emit events
        emit Transfer(address(0), tokenOwner, _totalSupply);
        emit SwapAndLiquifyEnabledUpdated(swapAndLiquifyEnabled);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function deliver(uint256 tAmount) public {
        address sender = _msgSender();
        (uint256 rAmount,,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _totalSupply, "Amt must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amt must be less than tot refl");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }
    
    function buyBackUpperLimitAmount() public view returns (uint256) {
        return _buyBackUpperLimit;
    }
    
    function _setMaxTxPercent(uint256 maxTxPercent) private {
        require(maxTxPercent >= minMxTxPercentage && maxTxPercent <= 100, "err");
        maxTxAmount = _totalSupply.mul(maxTxPercent).div(100);
    }

    function _setMaxWalletPercent(uint256 maxWalletPercent) private {
        require(maxWalletPercent >= minMxWalletPercentage && maxWalletPercent <= 100, "err");
        maxWalletAmount = _totalSupply.mul(maxWalletPercent).div(100);
    }

    function setFeeWallet(address payable newFeeWallet) external onlyOwner {
        require(newFeeWallet != address(0), "ZERO ADDRESS");
        feeWallet = newFeeWallet;
    }
    
    // To recieve ETH from pcsV2Router when swaping
    receive() external payable {}

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getTValues(tAmount);
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, tFee, tLiquidity, _getRate());
        return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee, tLiquidity);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256, uint256, uint256) {
        uint256 tFee = calculateTaxFee(tAmount);
        uint256 tLiquidity = calculateLiquidityFee(tAmount);
        uint256 tTransferAmount = tAmount.sub(tFee).sub(tLiquidity);
        return (tTransferAmount, tFee, tLiquidity);
    }

    function _getRValues(uint256 tAmount, uint256 tFee, uint256 tLiquidity, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = tFee.mul(currentRate);
        uint256 rLiquidity = tLiquidity.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee).sub(rLiquidity);
        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _totalSupply;      
          if (rSupply < _rTotal.div(_totalSupply)) {
            return (_rTotal, _totalSupply);
        }
        return (rSupply, tSupply);
    }
    
    function _takeLiquidity(uint256 tLiquidity) private {
        uint256 currentRate =  _getRate();
        uint256 rLiquidity = tLiquidity.mul(currentRate);
        _rOwned[address(this)] = _rOwned[address(this)].add(rLiquidity);
    }
    
    function calculateTaxFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(taxFee).div(100);
    }

    function calculateLiquidityFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(liquidityFee + burnFee + walletFee + buybackFee).div(100);
    }
    
    function removeAllFee() private {
        if(taxFee == 0 && liquidityFee == 0 && burnFee == 0 && walletFee == 0 && buybackFee == 0) return;
        
        _previousTaxFee = taxFee;
        _previousLiquidityFee = liquidityFee;
        _previousBurnFee = burnFee;
        _previousWalletFee = walletFee;
        _previousBuybackFee = buybackFee;
        
        taxFee = 0;
        liquidityFee = 0;
        burnFee = 0;
        walletFee = 0;
        buybackFee = 0;
    }
    
    function restoreAllFee() private {
        taxFee = _previousTaxFee;
        liquidityFee = _previousLiquidityFee;
        burnFee = _previousBurnFee;
        walletFee = _previousWalletFee;
        buybackFee = _previousBuybackFee;
    }
    
    function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from zero address");
        require(spender != address(0), "ERC20: approve to zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if(from != owner() && to != owner()) {
            require(amount <= maxTxAmount, "Transfer amount exceeds the maxTxAmount.");
        }

        if(from != owner() && to != owner() && to != address(0) && to != _dead && to != pcsV2Pair){
            uint256 contractBalanceRecepient = balanceOf(to);
            require(contractBalanceRecepient + amount <= maxWalletAmount, "Exceeds maximum wallet amount"); 
        }
        // is the token balance of this contract address over the min number of
        // tokens that we need to initiate a swap + liquidity lock?
        // also, don't get caught in a circular liquidity event.
        // also, don't swap & liquify if sender is PancakeSwap pair.
        uint256 contractTokenBalance = balanceOf(address(this));
        
        if(contractTokenBalance >= maxTxAmount) {
            contractTokenBalance = maxTxAmount;
        }
        
        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;
        if (!_inSwapAndLiquify && to == pcsV2Pair && swapAndLiquifyEnabled) {
            if(overMinTokenBalance) {
                contractTokenBalance = numTokensSellToAddToLiquidity;
                //add liquidity
                swapAndLiquify(contractTokenBalance);
            }
            if(buybackFee !=0) {
                uint256 balance = address(this).balance;
                if (balance > _buyBackMinLimit) {
                    
                    if (balance > _buyBackUpperLimit) {
                        balance = _buyBackUpperLimit;
                    }
                    
                    buyBackTokens(balance);
                }
            }            
        }        
        
        // Indicates if fee should be deducted from transfer
        bool takeFee = true;
        
        // If any account belongs to _isExcludedFromFee account then remove the fee
        if(isExcludedFromFee(from) || isExcludedFromFee(to)) {
            takeFee = false;
        }
        
        // Transfer amount, it will take tax, burn, liquidity fee
        _tokenTransfer(from, to, amount, takeFee);
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        // This needs to be distributed among burn, wallet and liquidity burn
        uint8 totFee  = burnFee + walletFee + liquidityFee + buybackFee; 
        uint256 spentAmount = 0;
        uint256 totSpentAmount = 0;
        if(burnFee != 0) {
            spentAmount  = contractTokenBalance.div(totFee).mul(burnFee);
            _tokenTransferNoFee(address(this), _dead, spentAmount);
            totSpentAmount = spentAmount;
        }

        if(walletFee != 0) {
            spentAmount = contractTokenBalance.div(totFee).mul(walletFee);
            _tokenTransferNoFee(address(this), feeWallet, spentAmount);
            totSpentAmount = totSpentAmount + spentAmount;
        }

        if(buybackFee != 0) {
            spentAmount = contractTokenBalance.div(totFee).mul(buybackFee);
            swapTokensForBNB(spentAmount);
            totSpentAmount = totSpentAmount + spentAmount;
        }

        if(liquidityFee != 0) {
            contractTokenBalance = contractTokenBalance.sub(totSpentAmount);

            // Split the contract balance into halves
            uint256 half = contractTokenBalance.div(2);
            uint256 otherHalf = contractTokenBalance.sub(half);

            // Capture the contract's current ETH balance.
            // This is so that we can capture exactly the amount of ETH that the
            // swap creates, and not make the liquidity event include any ETH that
            // has been manually sent to the contract
            uint256 initialBalance = address(this).balance;

            // Swap tokens for ETH
            swapTokensForBNB(half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

            // How much ETH did we just swap into?
            uint256 newBalance = address(this).balance.sub(initialBalance);

            // Add liquidity to PancakeSwap
            addLiquidity(otherHalf, newBalance);

            emit SwapAndLiquify(half, newBalance, otherHalf);
        }
    }

    function buyBackTokens(uint256 amount) private lockTheSwap {
    	if (amount > 0) {
    	    swapBNBForTokens(amount);
	    }
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        // generate the PancakeSwap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = pcsV2Router.WETH();

        _approve(address(this), address(pcsV2Router), tokenAmount);

        // make the swap
        uint256 minAmount = uint256(1 * 10**_decimals).div(100); // 0.01 token
        pcsV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            minAmount, // accept min 0.01 amount of Tokens
            path,
            address(this),
            block.timestamp
        );
    }

    function swapBNBForTokens(uint256 amount) private {
        // generate the PancakeSwap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = pcsV2Router.WETH();
        path[1] = address(this);

        // make the swap
        uint256 minAmount = uint256(1 * 10**_decimals).div(100); // 0.01 token
        pcsV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: amount}(
            minAmount, // accept min 0.01 amount of Tokens
            path,
            _dead, // Burn address
            block.timestamp.add(300)
        );        
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(pcsV2Router), tokenAmount);

        // add the liquidity
        pcsV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            _dead,
            block.timestamp
        );
    }

    //this method is responsible for taking all fee, if takeFee is true
    function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
        if(!takeFee) {
            removeAllFee();
        }

        _transferStandard(sender, recipient, amount);
        
        if(!takeFee) {
            restoreAllFee();
        }
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tLiquidity);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _tokenTransferNoFee(address sender, address recipient, uint256 amount) private {
        uint256 currentRate =  _getRate();  
        uint256 rAmount = amount.mul(currentRate);   

        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rAmount); 
        
        emit Transfer(sender, recipient, amount);
    }
}