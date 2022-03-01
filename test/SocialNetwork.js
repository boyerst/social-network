// Import contract
const SocialNetwork = artifacts.require('./SocialNetwork.sol')

// Require Chai
  // All quoted requires are in package.json and come with Truffle 
require('Chai')
  .use(require('chai-as-promised'))
  .should()

// Create skeleton for tests
  // Pass in callback function
    // Callback has a var that contains all accounts provided by Ganache
    // accounts is an array of all accounts
    // We use said accounts as examples inside of the tests
contract('SocialNetwork', (accounts) => {
  // Basic test to confirm contract deployment
  // We confirm deployment by confirming contract addess is on blockchain
    // This var represents the contract deployed to the blockchain
  let socialNetwork

  // Use a hook to assign this varaible the value of the deployed contract
  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      // REFACTOR: we removed assignment of contract here to do it in a before() so it can be used in all tests
      // Fetch the contract
        // We have already declared socialNetwork with let, so we can assign this variable value
      // socialNetwork = await SocialNetwork.deployed()

      // Fetch contract address  
      const address = await socialNetwork.address
      // "assert.condition (1st value, 2nd value)"
      // Ensure address is not blank
      assert.notEqual(address, 0x0)
      // ...not empty string
      assert.notEqual(address, '')
      // ...not null
      assert.notEqual(address, null)
      // ... not undefined
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await socialNetwork.name()
      assert.equal(name, 'Social Network')    
    })
  })
      
})
