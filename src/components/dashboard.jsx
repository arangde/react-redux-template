import React from 'react';
import { connect } from 'react-redux';

import actions from '../redux/actions';

import {
  Row,
  Col,
  Grid,
  Panel,
  Alert,
} from '@sketchpixy/rubix';

@connect((state) => state)
export default class Dashboard extends React.Component {

  render() {
    return (
        <div id='body'>
          <div id="body-header">
            <h2>Dashboard</h2>
          </div>
        </div>
    );
  }
}
