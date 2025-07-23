// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SelfProtocolContract
 * @dev Contract for managing recovery addresses with signature verification
 */
contract SelfProtocolRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Mapping from user address to their recovery address
    mapping(address => address) private recoveryAddresses;

    // Events
    event RecoveryRegistered(address indexed user, address indexed recoveryAddress);
    event RecoveryCleanedUp(address indexed user);

    // Errors
    error InvalidSignature();
    error ZeroAddress();
    error NoRecoveryAddressSet();

    /**
     * @dev Register a recovery address for the caller
     * @param recoveryAddress The address to be used for recovery
     * @param signature The signature of the recovery address by the user
     */
    function registerRecovery(address recoveryAddress, bytes memory signature) external {
        if (recoveryAddress == address(0)) {
            revert ZeroAddress();
        }

        // Create the message hash that should have been signed
        // The user should sign the recovery address they want to register
        bytes32 messageHash = keccak256(abi.encodePacked(recoveryAddress));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // Recover the signer from the signature
        address signer = ethSignedMessageHash.recover(signature);

        // Verify that the signature was created by the caller
        if (signer != msg.sender) {
            revert InvalidSignature();
        }

        // Store the recovery address
        recoveryAddresses[msg.sender] = recoveryAddress;

        emit RecoveryRegistered(msg.sender, recoveryAddress);
    }

    /**
     * @dev Clean up the recovery address for the caller
     * @param signature The signature of the caller's own address
     */
    function cleanupRecovery(bytes memory signature) external {
        // Check if there's a recovery address to clean up
        if (recoveryAddresses[msg.sender] == address(0)) {
            revert NoRecoveryAddressSet();
        }

        // Create the message hash that should have been signed
        // The user should sign their own address to prove ownership
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // Recover the signer from the signature
        address signer = ethSignedMessageHash.recover(signature);

        // Verify that the signature was created by the caller
        if (signer != msg.sender) {
            revert InvalidSignature();
        }

        // Clean up the recovery address
        delete recoveryAddresses[msg.sender];

        emit RecoveryCleanedUp(msg.sender);
    }

    /**
     * @dev Get the recovery address associated with a user address
     * @param user The user address to query
     * @return The recovery address associated with the user, or address(0) if none set
     */
    function getRecoveryAddress(address user) external view returns (address) {
        return recoveryAddresses[user];
    }
}
