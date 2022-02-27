pragma solidity ^0.5.0;


contract SocialNetwork {

  // By giving this var a public visibility modifier Solidity will give us a free function to be able to read this variable
    // We can simply call name()
  string public name;

  constructor() public {
    name = "Social Network";

  }

}