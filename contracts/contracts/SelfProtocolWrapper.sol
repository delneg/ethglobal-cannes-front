pragma solidity ^0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {AttestationId} from "@selfxyz/contracts/contracts/constants/AttestationId.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SelfProtocolWrapper is SelfVerificationRoot {
    bool public isInRecoveryMode;
    address public proposedAddress;

    uint256 public nullifier;
    address public allowedSigner;

    address public master;

    event NullifierSet(uint256 nullifier);
    event AllowedSigner(address allowedSigner);

    event RecoveryModeEnabled();
    event RecoveryModeDisabled();

    constructor(
        uint256 _scope // Application-specific scope identifier,
    ) SelfVerificationRoot(0x68c931C9a534D37aa78094877F46fE46a49F1A51, _scope) {
        master = msg.sender;
    }

    function enableRecoveryMode() public {
        isInRecoveryMode = true;
        emit RecoveryModeEnabled();
    }

    function disableRecoveryMode() public {
        isInRecoveryMode = false;
        emit RecoveryModeDisabled();
    }

    function proposeRecovery(address _proposedAddress) public {
        proposedAddress = _proposedAddress;
        isInRecoveryMode = true;
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData // Custom data from the qr code configuration
    ) public view override returns (bytes32) {
        return 0xd6edf00b6c00c704912af318c200203cba67a19e57cc23dc76d82255c5f2096e;
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal virtual override {
        if (!isInRecoveryMode) {
            // Nullifier can be set only for master
            address recoveredAddress = address(uint160(output.userIdentifier));
            require(recoveredAddress == master, "Only master can set nullifier");

            nullifier = output.nullifier;

            emit NullifierSet(nullifier);
        } else {
            // Otherwise we are in recovery mode. If proposed address can provide a valid proof,
            // we can set the new allowed signer
            require(nullifier == output.nullifier, "Wrong nullifier provided");

            allowedSigner = proposedAddress;
            isInRecoveryMode = false;

            emit AllowedSigner(allowedSigner);
        }
    }
}