/**
 * Created by jarosanger on 8/15/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTimeout from 'react-timeout';
import { FacebookLogin } from 'react-facebook-login-component';

import { FACEBOOK_APPID } from '../../constants';
import actions from '../../redux/actions';

import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Checkbox,
    Button,
    Alert
} from '@sketchpixy/rubix';

class Login extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {isSignedUp: false};
    }

    componentWillReceiveProps (nextProps) {
        const { router } = this.props;
        const { isAuthenticated } = nextProps;
        if (isAuthenticated) {
            let { dispatch } = this.props;
            dispatch(actions.getUser());
            this.props.setTimeout(dispatch(actions.getProfile()), 1000);

            const redirectRoute = this.props.location.query.next || '/';
            router.push(redirectRoute);
        }
    }

    responseFacebook (response) {
        console.log(response);
    }

    login(e) {
        e.preventDefault();

        let username = ReactDOM.findDOMNode(this.username).value;
        let password = ReactDOM.findDOMNode(this.password).value;
        let rememberMe = this.rememberMe.checked;

        const { dispatch } = this.props;

        dispatch(actions.resetSignup());
        dispatch(actions.loginUser(username, password, rememberMe));
    }

    render() {
        const { isAuthenticating, statusText, isSignedUp, signupStatusText } = this.props;
        const facebookButtonText = <span><span className="rubix-icon icon-ikons-facebook-1 pull-left"></span>Login With Facebook</span>;
        let signupAlert = null;
        if(isSignedUp) {
            signupAlert = <Alert success>{signupStatusText}</Alert>;
        }

        return (
            <div className="modal-wrapper">
                <div className="modal-content">
                    <Modal.Header>
                        <img src='/imgs/logo.png' alt='ArtTracks' />
                    </Modal.Header>
                    <Modal.Body>
                        {signupAlert}

                        <div className="h1 text-center">Login</div>
                        <p className="text-center">Don’t have an account yet? <Link to="/signup">Create an account.</Link></p>

                        <Form onSubmit={::this.login}>
                            <FormGroup className="text-center" controlId="email">
                                <FormControl type='text' id="email" placeholder='Your username' ref={(username) => this.username = username} autoFocus />
                            </FormGroup>
                            <FormGroup className="text-center" controlId="password">
                                <FormControl type='password' id="password" placeholder='Your password' ref={(password) => this.password = password} />
                            </FormGroup>
                            <FormGroup>
                                <Checkbox inputRef={(rememberMe) => { this.rememberMe = rememberMe; }} className="remember-me-checkbox pull-left">
                                    Remember me.
                                </Checkbox>
                                <Link className="pull-right" to="/forgot-password">Forgot password?</Link>
                            </FormGroup>
                            <hr className="transparent" />
                            <FormGroup>
                                <Button lg type='submit' bsStyle='primary' disabled={isAuthenticating} className="btn-block">Let me in.</Button>
                            </FormGroup>
                            <FormGroup className="has-error">
                                <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span>
                                <hr />
                            </FormGroup>
                        </Form>

                        {/*<p className="text-center">Or login using one of the below services:</p>

                        <FacebookLogin socialId={FACEBOOK_APPID}
                            language="en_US"
                            scope="public_profile,email"
                            responseHandler={this.responseFacebook}
                            xfbml={true}
                            version="v2.5"
                            class="btn btn-lg btn-primary btn-facebook btn-block"
                            buttonText={facebookButtonText} />

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
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.authStatusText,
    isSignedUp: state.auth.isSignedUp,
    signupStatusText: state.auth.signupStatusText,
});

export default connect(mapStateToProps)(ReactTimeout(Login));
