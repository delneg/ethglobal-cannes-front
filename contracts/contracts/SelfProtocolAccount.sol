pragma solidity ^0.8.28;

import {SelfProtocolWrapper} from "./SelfProtocolWrapper.sol";

contract SelfProtocolAccount {
    SelfProtocolWrapper public wrapper;

    event Initialized(address indexed wrapper);

    modifier onlyInitialized() {
        require(isInitialized(), "not initialized");
        _;
    }

    function initialize(uint256 scope) public {
        require(!isInitialized(), "already initialized");
        wrapper = new SelfProtocolWrapper(scope);

        emit Initialized(address(wrapper));
    }

    function isInitialized() public view returns (bool) {
        return address(wrapper) != address(0);
    }

    function getAllowedSigner() public view returns (address) {
        return wrapper.allowedSigner();
    }

//    function proposeRecovery(address _newSigner) public onlyInitialized {
//        wrapper.proposeRecovery(_newSigner);
//    }

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