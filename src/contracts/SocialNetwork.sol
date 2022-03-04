pragma solidity ^0.5.0;


contract SocialNetwork {

  // By giving this var a public visibility modifier Solidity will give us a free function to be able to read this variable
    // We can simply call name()
  string public name;
  uint public postCount = 0;

  // KEY = uint (id of the post), VALUE = struct (the Post)
  // Declare public so we can fetch posts from the mapping later
  mapping(uint => Post) public posts;


  // How do we create the post itself? Where is it stored? Here we use a data structure called a struct
  // To model your struct, simply think about all of the data your app's functionality requires and include it
  struct Post {
    // Unique Id for posts
    uint id;
    // Post content
    string content;
    // Tip
    uint tipAmount;
    // Address of author to send tips to
    address author;
  }

  event PostCreated(
   uint id, 
   string content,
   uint tipAmount, 
   address payable author
  );


  constructor() public {
    name = "Social Network";

  }

  // Pass in a string variable 'content' that has the value of the users' content  
  function createPost(string memory _content) public {
    // REQUIRE VALID CONTENT
      // Takes the content string and converts it to a bytes array, must be > 0
    require(bytes(_content).length > 0);
    // INCREMENT THE POST
    // Creat a new _id for every post that is created - using a counter cache
    // First we create a state var with initial value of 0
    // Everytime a new post is created, that var is incremented by 1 with the new value being assigned to the newly created post
    // We assign the new _id to the new post by passing it in below as the postCount
      // postCount is passed into the new post and becomes the new id for said post
      // The next time around, the postCount will be incremented by 1 and assigned all over again
    postCount ++;
    // CREATE THE POST
      // Pass in the args from the data structure
    //_post = Post(postCount, _content, 0, msg.sender);
    // Find a home for the new Post...
    // Pass in the id where the post will be stored (because the mapping KEY where is is stored is the Id)
    // mappingName[_id(KeyToPassToMapping)] = _post (that we just created above)
    //posts[postCount] = _post;
    // We can consolidate lines 45 & 49 to create post and save to blockchain all in one line like so:
    // mapping[key] = value
      // PostCount: doesn't need to be passed bc is a state var that we access and increment within the function
      // _content: passed into the function
      // 0: default tipAmount
      // msg.sender: doesn't need to be passed in bc will grab from the person createing the post
        // Will be saved as the author value inside of the struct which will be saved inside of the post mapping
    posts[postCount] = Post(postCount, _content, 0, msg.sender);
    // TRIGGER EVENT
      // To be trigged by smart contract and subscribed to by external consumers
      // We emit the eaxact same values that we passed into the mapping
    emit PostCreated(postCount, _content, 0, msg.sender);


  }

}


