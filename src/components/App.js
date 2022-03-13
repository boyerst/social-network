import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar';

class App extends Component {


  async componentWillMount() {
    // Call and load our web3 - wait for it to happen before we do anything else
    await this.loadWeb3()
    // Call our function that shows us we are connected to web3
    await this.loadBlockchainData()
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


  async loadBlockchainData() {
    // Establish connection to web3 and stash the web3 value
    const web3 = window.web3
    // Log to validate connection
    console.log(web3)
    // Fetch the account we are connected to with MetaMask and log it onto the page
      // getAccounts is a callback to the web3-eth package that comes with web3js
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Log the first Ganache account that we connected to via MetaMask
    console.log("account", accounts[0])
    console.log(accounts)
    // Fetch NetworkID
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = SocialNetwork.networks[networkId]
    console.log(networkData)
    if(networkData) {
      // Fetch and pass in Address and ABI
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      console.log(postCount)
      
    } else {
      window.alert('SocialNetwork contract not deployed to the detected network.')
    }

  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0
    }
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
