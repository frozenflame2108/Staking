const DaiToken = artifacts.require('DaiToken')
const OhmToken = artifacts.require('OhmToken')
const Staking = artifacts.require('Staking')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('Staking', ([owner, investor]) => {
  let daiToken, ohmToken, staking

  before(async () => {
 
    daiToken = await DaiToken.new()
    ohmToken = await OhmToken.new()
    staking = await Staking.new(ohmToken.address, daiToken.address)


    await ohmToken.transfer(staking.address, tokens('1000000'))


    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Ohm Token deployment', async () => {
    it('has a name', async () => {
      const name = await ohmToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await staking.name()
      assert.equal(name, 'Ohm Token Farm')
    })

    it('contract has tokens', async () => {
      let balance = await ohmToken.balanceOf(staking.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result


      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')


      await daiToken.approve(staking.address, tokens('100'), { from: investor })
      await staking.Deposite(tokens('100'), { from: investor })


      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(staking.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

      result = await staking.investingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await staking.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')


      await staking.issue({ from: owner })


      result = await ohmToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

  
      await staking.issue({ from: investor }).should.be.rejected;


      await staking.Withdraw({ from: investor })

 
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(staking.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await staking.investingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await staking.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})
