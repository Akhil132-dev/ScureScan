const Securescan = artifacts.require("Securescan");

module.exports = function (deployer) {
  deployer.deploy(Securescan);
}; 
