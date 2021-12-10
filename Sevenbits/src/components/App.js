import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import OhmToken from '../abis/OhmToken.json'
import Staking from '../abis/Staking.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

 
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else {
      window.alert('DaiToken contract not deployed to detected network.')
    }


    const ohmTokenData = OhmToken.networks[networkId]
    if(ohmTokenData) {
      const ohmToken = new web3.eth.Contract(OhmToken.abi, ohmTokenData.address)
      this.setState({ ohmToken })
      let ohmTokenBalance = await ohmToken.methods.balanceOf(this.state.account).call()
      this.setState({ ohmTokenBalance: ohmTokenBalance.toString() })
    } else {
      window.alert('OhmToken contract not deployed to detected network.')
    }


    const stakingData = Staking.networks[networkId]
    if(stakingData) {
      const staking = new web3.eth.Contract(Staking.abi, stakingData.address)
      this.setState({ staking })
      let investingBalance = await staking.methods.investingBalance(this.state.account).call()
      this.setState({ investingBalance: investingBalance.toString() })
    } else {
      window.alert('Staking contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  Deposite = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.staking._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.staking.methods.Deposite(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  Withdraw = (amount) => {
    this.setState({ loading: true })
    this.state.staking.methods.Withdraw().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      ohmToken: {},
      staking: {},
      daiTokenBalance: '0',
      ohmTokenBalance: '0',
      investingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        ohmTokenBalance={this.state.ohmTokenBalance}
        investingBalance={this.state.investingBalance}
        Deposite={this.Deposite}
        Withdraw={this.Withdraw}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="www.sevenbits.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
