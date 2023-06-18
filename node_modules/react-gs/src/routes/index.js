import React from 'react';
import Main from './../containers/Main';
import Demo from './../components/Demo';
import { Router, Route, DefaultRoute } from 'react-router';

export default (
  <Route name="app" path="/" handler={Main}>
    <DefaultRoute handler={Demo} />
  </Route>
);

