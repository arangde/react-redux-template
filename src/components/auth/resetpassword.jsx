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

class ResetPassword extends React.Component {
  componentWillReceiveProps (nextProps) {

  }

  resetPassword(e) {
    e.preventDefault();

    let password = ReactDOM.findDOMNode(this.password).value;
    let passwordConfirm = ReactDOM.findDOMNode(this.passwordConfirm).value;

    const uid = this.props.params.uid;
    const token = this.props.params.token;

    let { dispatch } = this.props;

    dispatch(actions.resetPassword(password, passwordConfirm, uid, token));
  }

  render() {
    const { isResetting, isReset, statusText } = this.props;
    const className = (isReset)? 'has-success': 'has-error';

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

            <Form onSubmit={::this.resetPassword}>
              <FormGroup>
                <FormControl type='password' id="password" placeholder='New Password' ref={(password) => this.password = password} autoFocus />
              </FormGroup>
              <FormGroup>
                <FormControl type='password' id="passwordConfirm" placeholder='Password confirm' ref={(passwordConfirm) => this.passwordConfirm = passwordConfirm} />
              </FormGroup>
              <hr className="transparent" />
              <FormGroup>
                <Button lg type='submit' bsStyle='primary' disabled={isResetting} className="btn-block">Reset Password</Button>
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
  isReset: state.auth.isReset,
  isResetting: state.auth.isResetting,
  statusText: state.auth.resetStatusText
});

export default connect(mapStateToProps)(ResetPassword);