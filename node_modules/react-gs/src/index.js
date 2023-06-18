import React from 'react'
import Router from 'react-router'
import routes from './routes/'

Router.run(routes, (Root, state) => {
  React.render(<Root {...state} />, document.body);
});
