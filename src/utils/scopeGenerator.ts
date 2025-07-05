import {
  poseidon1,
  poseidon2,
  poseidon3,
  poseidon4,
  poseidon5,
  poseidon6,
  poseidon7,
  poseidon8,
  poseidon9,
  poseidon10,
  poseidon11,
  poseidon12,
  poseidon13,
  poseidon14,
  poseidon15,
  poseidon16,
} from 'poseidon-lite';

export function formatEndpoint(endpoint: string) {
  if (!endpoint) return '';
  return endpoint.replace(/^https?:\/\//, '').split('/')[0];
}

export function hashEndpointWithScope(endpoint: string, scope: string) {
  const formattedEndpoint = formatEndpoint(endpoint);
  const endpointChunks = [];
  let remaining = formattedEndpoint;
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, 31);
    endpointChunks.push(chunk);
    remaining = remaining.slice(31);
  }
  if (endpointChunks.length > 16) {
    throw new Error('Endpoint must be less than 496 characters');
  }
  const chunkedEndpointBigInts = endpointChunks.map(stringToBigInt);
  const endpointHash = flexiblePoseidon(chunkedEndpointBigInts);
  const scopeBigInt = stringToBigInt(scope);
  return poseidon2([endpointHash, scopeBigInt]).toString();
}

export function stringToBigInt(str: string) {
  // Validate input contains only ASCII characters
  if (!/^[\x00-\x7F]*$/.test(str)) {
    throw new Error('Input must contain only ASCII characters (0-127)');
  }

  let result = 0n;
  for (let i = 0; i < str.length; i++) {
    result = (result << 8n) | BigInt(str.charCodeAt(i));
  }

  // Check size limit
  const MAX_VALUE = (1n << 248n) - 1n;
  if (result > MAX_VALUE) {
    console.log(`str: ${str}, str.length: ${str.length}`);
    throw new Error('Resulting BigInt exceeds maximum size of 31 bytes');
  }

  return result;
}

export function flexiblePoseidon(inputs: bigint[]) {
  switch (inputs.length) {
    case 1:
      return poseidon1(inputs);
    case 2:
      return poseidon2(inputs);
    case 3:
      return poseidon3(inputs);
    case 4:
      return poseidon4(inputs);
    case 5:
      return poseidon5(inputs);
    case 6:
      return poseidon6(inputs);
    case 7:
      return poseidon7(inputs);
    case 8:
      return poseidon8(inputs);
    case 9:
      return poseidon9(inputs);
    case 10:
      return poseidon10(inputs);
    case 11:
      return poseidon11(inputs);
    case 12:
      return poseidon12(inputs);
    case 13:
      return poseidon13(inputs);
    case 14:
      return poseidon14(inputs);
    case 15:
      return poseidon15(inputs);
    case 16:
      return poseidon16(inputs);
    default:
      throw new Error(`Unsupported number of inputs: ${inputs.length}`);
  }
}
