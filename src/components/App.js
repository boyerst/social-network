import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar';
import Main from './Main';


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
        this.setState({ loading: false })
      }
      console.log({ posts: this.state.posts })
    } else {
      window.alert('SocialNetwork contract not deployed to the detected network.')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    // We call the contract with this.state.socialNetwork
    // Then we add our method and .send() our method
    // When we .send() we pass in the author's account
    // .once receipt received we tell our state that the loader is no longer loading
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account }).once('receipt', (receipt) => {this.setState({ loading: false })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }

    this.createPost = this.createPost.bind(this)
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main 
              posts={this.state.posts} 
              createPost={this.createPost}
            />
        }
      </div>
    );
  }
}

export default App;
