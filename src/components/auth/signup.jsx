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

class Signup extends React.Component {

    componentWillMount () {
        const { dispatch } = this.props;
        dispatch(actions.resetSignup());
    }

    componentWillReceiveProps (nextProps) {
        const { router } = this.props;
        const { isSignedUp } = nextProps;
        if (isSignedUp) {
            router.push('/login');
        }
    }

    signup(e) {
        e.preventDefault();

        let email = ReactDOM.findDOMNode(this.email).value;
        let username = ReactDOM.findDOMNode(this.username).value;
        let password = ReactDOM.findDOMNode(this.password).value;
        let passwordConfirm = ReactDOM.findDOMNode(this.passwordConfirm).value;

        const { dispatch } = this.props;

        dispatch(actions.signupUser(email, username, password, passwordConfirm));
    }

  render() {
    const { isSigningUp, statusText } = this.props;

    return (
      <div className="modal-wrapper">
        <div className="modal-content">
          <Modal.Header>
            <img src='/imgs/logo.png' alt='ArtTracks' />
          </Modal.Header>
          <Modal.Body>
            <div className="h1 text-center">Create an account.</div>
            <p className="text-center">Have an account already? <Link to="/login">Log in.</Link></p>

            <Form onSubmit={::this.signup}>
              <FormGroup className="text-center" controlId="email">
                <FormControl type='text' id="email" placeholder='Enter your email address' ref={(email) => this.email = email} autoFocus />
              </FormGroup>
              <FormGroup className="text-center" controlId="username">
                <FormControl type='text' id="username" placeholder='Enter your username' ref={(username) => this.username = username} />
              </FormGroup>
              <FormGroup className="text-center" controlId="password">
                <FormControl type='password' id="password" placeholder='Choose your password' ref={(password) => this.password = password} />
              </FormGroup>
              <FormGroup className="text-center" controlId="password_confirm">
                <FormControl type='password' id="password_confirm" placeholder='Confirm your password' ref={(passwordConfirm) => this.passwordConfirm = passwordConfirm} />
              </FormGroup>
              <FormGroup className="text-center font13">
                By signing up, you agree to ArtTracks’ <a href="#">Terms of Use.</a>
              </FormGroup>
              <hr className="transparent" />
              <FormGroup>
                <Button lg type='submit' bsStyle='primary' disabled={isSigningUp} className="btn-block">Sign me up.</Button>
              </FormGroup>
              <FormGroup className="has-error">
                <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span>
                <hr />
              </FormGroup>
            </Form>

            {/*}<p className="text-center">Or login using one of the below services:</p>

            <Button lg bsStyle="primary" className="btn-facebook btn-block">
              <span className="rubix-icon icon-ikons-facebook-1 pull-left"></span>
              Login with Facebook
            </Button>

            <Button lg bsStyle="primary" className="btn-twitter btn-block">
              <span className="rubix-icon icon-ikons-twitter pull-left"></span>
              Login with Twitter
            </Button>*/}
          </Modal.Body>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
    isSignedUp: state.auth.isSignedUp,
    isSigningUp: state.auth.isSigningUp,
    statusText: state.auth.signupStatusText
});

export default connect(mapStateToProps)(Signup);
