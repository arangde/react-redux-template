/**
 * Created by jarosanger on 8/15/16.
 */
import { RESET_USER_AUTH, LOGOUT_USER, SET_USER_AUTH,
    LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS,
    SIGNUP_USER_REQUEST, SIGNUP_USER_FAILURE, SIGNUP_USER_SUCCESS, SIGNUP_USER_RESET,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_SENT,
    RESET_PASSWORD_REQUEST, RESET_PASSWORD_FAILURE, RESET_PASSWORD_SUCCESS
} from '../../constants';

const initialState = {
    token: null,
    username: null,
    isAuthenticated: false,
    isAuthenticating: false,
    authStatusText: null,

    isSigningUp: false,
    isSignedUp: false,
    signupStatusText: null,

    isSendingEmail: false,
    isSentEmail: false,
    forgotStatusText: null,

    isResetting: false,
    isReset: false,
    resetStatusText: null,
};

function auth(state = initialState, action) {
    switch(action.type) {

        case RESET_USER_AUTH:
            return Object.assign({}, initialState);
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case SET_USER_AUTH:
            return Object.assign({}, state, {
                'isAuthenticated': true
            });
        case LOGIN_USER_REQUEST:
            return Object.assign({}, state, {
                'isAuthenticating': true,
                'authStatusText': null
            });
        case LOGIN_USER_SUCCESS:
            return Object.assign({}, state, {
                'isAuthenticating': false,
                'isAuthenticated': true,
                'token': action.payload.token,
                'username': action.payload.username,
                'authStatusText': 'You have been successfully logged in.'
            });
        case LOGIN_USER_FAILURE:
            return Object.assign({}, state, {
                'isAuthenticating': false,
                'isAuthenticated': false,
                'token': null,
                'username': null,
                'authStatusText': action.payload.statusText
            });

        case SIGNUP_USER_REQUEST:
            return Object.assign({}, state, {
                'isSigningUp': true,
                'signupStatusText': null
            });
        case SIGNUP_USER_SUCCESS:
            return Object.assign({}, state, {
                'isSigningUp': false,
                'isSignedUp': true,
                'signupStatusText': `You have been successfully signed up with \nusername '${action.payload.username}' and email '${action.payload.email}'.`,
            });
        case SIGNUP_USER_FAILURE:
            return Object.assign({}, state, {
                'isSigningUp': false,
                'isSignedUp': false,
                'signupStatusText': action.payload.statusText
            });
        case SIGNUP_USER_RESET:
            return Object.assign({}, state, {
                'isSigningUp': false,
                'isSignedUp': false,
                'signupStatusText': null,
            });

        case FORGOT_PASSWORD_REQUEST:
            return Object.assign({}, state, {
                'isSendingEmail': true,
                'forgotStatusText': null
            });
        case FORGOT_PASSWORD_SENT:
            return Object.assign({}, state, {
                'isSendingEmail': false,
                'isSentEmail': true,
                'forgotStatusText': 'An e-mail has been sent to you which explains how to reset your password.'
            });
        case FORGOT_PASSWORD_FAILURE:
            return Object.assign({}, state, {
                'isSending': false,
                'isSent': false,
                'forgotStatusText': action.payload.statusText
            });

        case RESET_PASSWORD_REQUEST:
            return Object.assign({}, state, {
                'isResetting': true,
                'resetStatusText': null
            });
        case RESET_PASSWORD_SUCCESS:
            return Object.assign({}, state, {
                'isResetting': false,
                'isReset': true,
                'resetStatusText': 'An e-mail has been sent to you which explains how to reset your password.'
            });
        case RESET_PASSWORD_FAILURE:
            return Object.assign({}, state, {
                'isResetting': false,
                'isReset': false,
                'resetStatusText': action.payload.statusText
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    auth,
};