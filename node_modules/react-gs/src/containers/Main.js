import React from 'react';
import { RouteHandler } from 'react-router';

class Main extends React.Component{
  render(){
    return (
      <div style={{paddingLeft: 32, paddingRight: 32}}>
        <RouteHandler {...this.props}/>
      </div>
    )
  }
}

export default Main;
