pragma solidity ^0.8.28;

import {SelfProtocolWrapper} from "./SelfProtocolWrapper.sol";

contract SelfProtocolAccount {
    address internal constant TESTNET_IDENTITY_HUB_ADDRESS = 0x68c931C9a534D37aa78094877F46fE46a49F1A51;
    address internal constant MAINNET_IDENTITY_HUB_ADDRESS = 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF;

    SelfProtocolWrapper public wrapper;

    event Initialized(address indexed wrapper);

    modifier onlyInitialized() {
        require(isInitialized(), "not initialized");
        _;
    }

    function initialize(uint256 scope, bool isProduction) public {
        require(!isInitialized(), "already initialized");

        if (isProduction) {
            wrapper = new SelfProtocolWrapper(MAINNET_IDENTITY_HUB_ADDRESS, scope);
        } else {
            wrapper = new SelfProtocolWrapper(TESTNET_IDENTITY_HUB_ADDRESS, scope);
        }

        emit Initialized(address(wrapper));
    }

    function isInitialized() public view returns (bool) {
        return address(wrapper) != address(0);
    }

    function getAllowedSigner() public view returns (address) {
        return wrapper.allowedSigner();
    }

    function enableRecoveryMode() public onlyInitialized {
        wrapper.enableRecoveryMode();
    }

    function disableRecoveryMode() public onlyInitialized {
        wrapper.disableRecoveryMode()();
    }

    function recover(address to, uint256 value, bytes calldata data) external {
        require(isInitialized(), "not initialized");
        require(!wrapper.isInRecoveryMode(), "we are in recovery mode");

        if (msg.sender != wrapper.allowedSigner()) {
            revert("Only allowed signer can recover");
        }

        (bool success, bytes memory returnData) = to.call{value: value}(data);
        require(success, "call failed");
    }
}