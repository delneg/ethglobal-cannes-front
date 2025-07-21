// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library UserDefinedDataLib {
    function bytesToAddress(bytes memory b) internal pure returns (address) {
        bytes memory preparedBytes = removeNonHexCharacters(b);
        return parseAddressFromPreparedBytes(preparedBytes);
    }

    function parseAddressFromPreparedBytes(bytes memory b) internal pure returns (address) {
        uint256 start = 0;
        // If starts with "0x", skip
        if (b.length >= 2 && b[0] == '0' && (b[1] == 'x' || b[1] == 'X')) {
            start = 2;
        }
        require(b.length - start == 40, "Invalid address length");

        uint160 result = 0;
        for (uint256 i = 0; i < 40; ++i) {
            result <<= 4;
            uint8 c = uint8(b[i + start]);

            if (c >= 48 && c <= 57) {
                result |= uint160(c - 48); // '0'-'9'
            } else if (c >= 65 && c <= 70) {
                result |= uint160(c - 55); // 'A'-'F'
            } else if (c >= 97 && c <= 102) {
                result |= uint160(c - 87); // 'a'-'f'
            } else {
                revert("Invalid hex character");
            }
        }

        return address(result);
    }

    function removeNonHexCharacters(bytes memory input) internal pure returns (bytes memory) {
        uint256 count;
        for (uint256 i; i < input.length; ++i) {
            bytes1 b = input[i];
            if (
                (b >= 0x30 && b <= 0x39) ||
                (b >= 0x61 && b <= 0x66) ||
                (b >= 0x41 && b <= 0x46)
            ) {
                ++count;
            }
        }

        bytes memory result = new bytes(count);
        uint256 j;
        for (uint256 i; i < input.length; ++i) {
            bytes1 b = input[i];
            if (
                (b >= 0x30 && b <= 0x39) ||
                (b >= 0x61 && b <= 0x66) ||
                (b >= 0x41 && b <= 0x46)
            ) {
                result[j++] = b;
            }
        }

        return result;
    }
}
