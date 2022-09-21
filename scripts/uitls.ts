export const toHex = (covertThis: any, padding: any) => {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

export const createGenericDepositData = (hexMetaData: any) => {
  if (hexMetaData === null) {
    return '0x' +
      toHex(0, 32).substr(2) // len(metaData) (32 bytes)
  }
  const hexMetaDataLength = (hexMetaData.substr(2)).length / 2;
  return '0x' +
    toHex(hexMetaDataLength, 32).substr(2) +
    hexMetaData.substr(2)
};

export const createResourceID = (contractAddress: any, domainID: any) => {
  return toHex(contractAddress + toHex(domainID, 1).substr(2), 32)
}