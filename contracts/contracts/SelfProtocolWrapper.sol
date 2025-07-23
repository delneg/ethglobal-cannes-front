// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {AttestationId} from "@selfxyz/contracts/contracts/constants/AttestationId.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {UserDefinedDataLib} from "./UserDefinedDataLib.sol";

contract SelfProtocolWrapper is SelfVerificationRoot {
    bool public isInRecoveryMode;

    uint256 public masterNullifier;

    address public masterSigner;
    address public allowedSigner;

    event NullifierSet(uint256 nullifier);
    event AllowedSigner(address allowedSigner);

    event RecoveryModeEnabled();
    event RecoveryModeDisabled();

    constructor(
        address _identityHubAddress,
        uint256 _scope // Application-specific scope identifier,
    ) SelfVerificationRoot(_identityHubAddress, _scope) {
        masterSigner = msg.sender;
    }

    function enableRecoveryMode() public {
        isInRecoveryMode = true;
        emit RecoveryModeEnabled();
    }

    function disableRecoveryMode() public {
        isInRecoveryMode = false;
        emit RecoveryModeDisabled();
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData // Custom data from the qr code configuration
    ) public view override returns (bytes32) {
        return 0xd6edf00b6c00c704912af318c200203cba67a19e57cc23dc76d82255c5f2096e;
    }

    function getMasterNullifier() public view returns (uint256) {
        return masterNullifier;
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal virtual override {
        if (masterNullifier == 0) {
            // Nullifier can be set only for master
            address recoveredAddress = address(uint160(output.userIdentifier));
            require(recoveredAddress == masterSigner, "Only master can set nullifier");

            masterNullifier = output.nullifier;

            emit NullifierSet(masterNullifier);
        } else {
            require(isInRecoveryMode, "Not in recovery mode");

            // Otherwise we are in recovery mode. If proposed address can provide a valid proof,
            // we can set the new allowed signer
            require(masterNullifier == output.nullifier, "Wrong nullifier provided");

            address parsedAddress = UserDefinedDataLib.bytesToAddress(userData);

            allowedSigner = parsedAddress;
            isInRecoveryMode = false;

            emit AllowedSigner(allowedSigner);
        }
    }
}