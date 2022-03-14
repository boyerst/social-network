import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar';
import Identicon from 'identicon.js';

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
      // Load posts
      for (var i = 1; i <= postCount; i++) {
        // Declare and fetch the post corresponding to the index (postId)
          // We call() the posts mapping by referencing contract.methods.method(Id)
        const post = await socialNetwork.methods.posts(i).call()
        // Store it in an array in state
        this.setState({
          // Instead of updating the actual array, we use ES6 spread operator
          posts: [...this.state.posts, post]
        })
      }
      console.log({ posts: this.state.posts })
    } else {
      window.alert('SocialNetwork contract not deployed to the detected network.')
    }

  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
    }
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style= {{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
              { this.state.posts.map((post, key) => {
                return(
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img 
                        className="mr-2"
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(this.state.account, 30).toString()}`}
                      />
                      <small className="text-muted">{post.author}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{post.content}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')}
                        </small>
                        <button className="btn btn-link btn-sm float-right pt-0">
                          <span>
                            TIP .1 ETH
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
