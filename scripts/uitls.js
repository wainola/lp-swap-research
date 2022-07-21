const toHex = (covertThis, padding) => {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

const createGenericDepositData = (hexMetaData) => {
  if (hexMetaData === null) {
    return '0x' +
      toHex(0, 32).substr(2) // len(metaData) (32 bytes)
  }
  const hexMetaDataLength = (hexMetaData.substr(2)).length / 2;
  return '0x' +
    toHex(hexMetaDataLength, 32).substr(2) +
    hexMetaData.substr(2)
};

module.exports = { toHex, createGenericDepositData }
