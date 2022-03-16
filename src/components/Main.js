import React, { Component } from 'react';
import Identicon from 'identicon.js';


class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style= {{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
                {/* Use onSubmit to trigger this event whenever the form is submitted 
                    We pass in event to represent our function
                */}
                <form onSubmit={(event) => {
                  // Prevent the page from reloading
                  event.preventDefault()
                  const content = this.postContent.value
                  // Call the function here -> executed in App.js which calls smart contract -> smart contract function executes
                  // How do we know what the content is? SEE var declared above and ref attribute in <input>
                  this.props.createPost(content)
                }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="postContent"
                    type="text"
                    // ref = the input of the <input> form
                    // We pass the input in and state that the input = this.postContent
                    // In our onSubmit, we declare 'content' as this.postContent.value AKA this.input.value
                    // Then we pass in our content variable to the function
                    ref={(input) => { this.postContent = input }}
                    className="form-control"
                    placeholder="What's on your mind?"
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
            <p>&nbsp;</p>
            { this.props.posts.map((post, key) => {
              return(
                <div className="card mb-4" key={key}>
                  <div className="card-header">
                    <img 
                      className="mr-2"
                      width='30'
                      height='30'
                      src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
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
                      <button 
                        className="btn btn-link btn-sm float-right pt-0"
                        name={post.id}
                        onClick={(event) => {
                          // Fetch Post ID (first use name attribute above)
                            // We declare the name attribute as post.id, then we target the 'name' attribute using 'event.target.name'
                              // The value that 'event.target.name' represents will be passed to tipPost()
                          // Declare tipAmount
                            // We set the tip as constant 0.1 ETH, and convert it to wei because the 'value' parameter for the web3 .send method requires wei denomination
                          let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                          this.props.tipPost(event.target.name, tipAmount)
                        }}
                      >
                          TIP .1 ETH
                      
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
    );
  }
}

export default Main;