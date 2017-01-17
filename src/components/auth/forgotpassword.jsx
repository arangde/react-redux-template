/**
 * Created by jarosanger on 8/15/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import actions from '../../redux/actions';

import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Button
} from '@sketchpixy/rubix';

class ForgotPassword extends React.Component {

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch(actions.resetSignup());
  }

  sendRequest(e) {
    e.preventDefault();

    let email = ReactDOM.findDOMNode(this.email).value;

    let { dispatch } = this.props;

    dispatch(actions.forgotPassword(email));
  }

  render() {
    const { isSentEmail, isSendingEmail, statusText } = this.props;
    const className = (isSentEmail)? 'has-success': 'has-error';

    return (
      <div className="modal-wrapper">
        <div className="modal-content">
          <Modal.Header>
            <img src='/imgs/logo.png' alt='ArtTracks' />
          </Modal.Header>
          <Modal.Body>
            <div className="h1 text-center">Reset password.</div>
            <p className="text-center">After resetting it a confirmation email will be sent.</p>
            <p className="text-center">Have an account already? <Link to="/login">Log in.</Link></p>

            <Form onSubmit={::this.sendRequest}>
              <FormGroup controlId="email">
                <FormControl type='email' id="email" placeholder='Your email address' ref={(email) => this.email = email} autoFocus />
              </FormGroup>
              <hr className="transparent" />
              <FormGroup>
                <Button lg type='submit' bsStyle='primary' disabled={isSendingEmail} className="btn-block">Send it.</Button>
              </FormGroup>
              <FormGroup className={className}>
                <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span>
              </FormGroup>
            </Form>
          </Modal.Body>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isSentEmail: state.auth.isSentEmail,
  isSendingEmail: state.auth.isSendingEmail,
  statusText: state.auth.forgotStatusText
});

export default connect(mapStateToProps)(ForgotPassword);