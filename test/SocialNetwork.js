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
contract('SocialNetwork', ([deployer, author, tipper]) => {
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
  
  describe('posts', async () => {
    // We say 'let result' so that we can access result later in the block, because we declare a variable using 'let' this means it will only be avail in the block
    let result, postCount
    // The two conditions we will check
      // 1. That the post was created (by digging into result below)
      // 2. That the postCount increased
    it('creates posts', async () => {
      // Call the createPosts() function
      // Pass in a hardcoded value for the post content ('This is my first post')
      // But, we need to know who the author of the post is 
      // This is where the keyword msg.sender comes in
      // We find out who is actually sending the function
      // We do this using function metadata
      // From the client perspective, inside of JavaScript, we pass in metadata AFTER the regular args - so here we pass it in AFTER the _content arg
      // The function itself, function createPosts(), only takes one regular arg (_content), but it also takes an OPTIONAL arg after the regular arg
      // The optional arg is an object, and this is where we will add all of the function metadata
      // We add 'from: ' which will correspond with msg.sender
      // Next we need to get the actual address of msg.sender
      // Recall that our callback function takes a var 'accounts' that represents all gananche accounts
        // We could pass in ...createPosts('This is my first post', accounts[0]) to fetch the account out of the array
        // Instead we will specify the account to be called w a specific var
        // We refactor the 'accounts' var we passed into our callback to an array that specifies 3 diff accounts that we will always refer to inside this test...
        // From (accounts) -> ([deployer, author, tipper])
          // deployer = the account that deploys the contract
          // author = the person who creates posts
          // tipper = the person who tips the author
      // Back to targeting the actual sender, we now specificy from: to correspond with the author as the msg.sender
      // Then we add await because it is async
        // "await for this thing to be done and go do something else while you do"
      result = await socialNetwork.createPost('This is my first post', { from: author })
      // Next we want to ensure that the post was created
      postCount = await socialNetwork.postCount()

      // SUCCESS
      assert.equal(postCount, 1)
      // We can grab data from the result object
        // This object contains logs which contains our event
      const event = result.logs[0].args
      // ↑↑↑ Once we access that event we can access and verify if id, content, tipAmount, author are all correct
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, 'This is my first post', 'content is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')
      // When we run truffle test this console will print before 'creates post' because the code execution continues to the end while we await createPost and postCount 
      console.log(result, '⬅ ❌ Result')
      console.log(event, '⬅ ❌ Event')
      console.log(postCount, '⬅ ❌ postCount')

      // FAILURE
        // Post must have content
      await socialNetwork.createPost('', { from: author }).should.be.rejected;


    })  
    // it('lists posts', async () => {
        
    // }) 
    // it('allows users to tip posts', async () => {
        
    // })
  })

})

























