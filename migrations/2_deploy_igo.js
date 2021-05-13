const IGO = artifacts.require("IGO");

module.exports = async (deployer) => {
  // const num = 50 * Math.pow(10, 18);
  // const numAsHex = "0x" + num.toString(16);

  const lpToken = '';
  const offeringToken = '';
  const startBlock = '';
  const endBlock = '';
  const offeringAmount = '100';
  const raisingAmount = '100000';
  const adminAddress = '';
  await deployer.deploy(
    IGO,
    lpToken,
    offeringToken,
    startBlock,
    endBlock,
    offeringAmount,
    raisingAmount,
    adminAddress
  );
};
