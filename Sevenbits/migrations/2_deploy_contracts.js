const OhmToken = artifacts.require('OhmToken')
const DaiToken = artifacts.require('DaiToken')
const Staking = artifacts.require('Staking')

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()


  await deployer.deploy(OhmToken)
  const ohmToken = await OhmToken.deployed()


  await deployer.deploy(Staking, ohmToken.address, daiToken.address)
  const tokenFarm = await Staking.deployed()

 
  await ohmToken.transfer(tokenFarm.address, '1000000000000000000000000')


  await daiToken.transfer(accounts[1], '100000000000000000000')
}
