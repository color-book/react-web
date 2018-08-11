import React, { Component } from 'react';
import './App.css';

class ShowResults extends Component {

  constructor() {
    super()

    this.state = {

    }

  }

  componentWillReceiveProps() {
    console.log('result props: ', this.props)
  }

  componentWillUpdate() {
    console.log('update props: ', this.props)
  }

  render() {

    return (
      <div className="App">

      </div>
    );
  }
}

export default ShowResults;
