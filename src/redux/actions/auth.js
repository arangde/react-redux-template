/**
 * Created by jarosanger on 8/15/16.
 */
import axios from 'axios';
import cookie from 'react-cookie';
import { BASE_API_URL, RESET_USER_AUTH, LOGOUT_USER, SET_USER_AUTH,
    LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS,
    SIGNUP_USER_REQUEST, SIGNUP_USER_FAILURE, SIGNUP_USER_SUCCESS, SIGNUP_USER_RESET,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_SENT,
    RESET_PASSWORD_REQUEST, RESET_PASSWORD_FAILURE, RESET_PASSWORD_SUCCESS
} from '../../constants';
import profile from './profile';
import { checkHttpStatus, parseJSON } from '../../services/utils';

function resetCookie() {
    cookie.remove('token', { path: '/' });
    cookie.remove('username', { path: '/' });
    cookie.remove('userId', { path: '/' });
    cookie.remove('email', { path: '/' });
    cookie.remove('fullName', { path: '/' });
}

function setCookie(data) {
    if(data.token)
        cookie.save('token', data.token, { path: '/' });
    if(data.username)
        cookie.save('username', data.username, { path: '/' });
}

function setLoggedIn() {
    return {
        type: SET_USER_AUTH
    }
}

function resetAuth() {
    resetCookie();
    return {
        type: RESET_USER_AUTH
    }
}

function logout() {
    resetCookie();
    return {
        type: LOGOUT_USER
    }
}

function loginUserFailure(errorText) {
    resetCookie();
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function loginUser(username, password, rememberMe) {
    return dispatch => {
        if(username.trim() == "") {
            dispatch(loginUserFailure('Email may not be blank'));
            return;
        }
        else if(password.trim() == "") {
            dispatch(loginUserFailure('Password may not be blank'));
            return;
        }

        dispatch({ type: LOGIN_USER_REQUEST });
        return axios({
            url: BASE_API_URL + 'obtain-auth-token/',
            method: 'post',
            responseType: 'json',
            data: {
                username: username, password: password, rememberMe: rememberMe
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('login response', response);
            const loginData = { token: response.data.token, username: username };
            setCookie(loginData);
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: loginData
            });
        })
        .catch((error) => {
            console.log(error);
            var errorTexts = [];
            if(error.response == undefined || error.response.data == undefined) {
                dispatch(loginUserFailure('Authentication Error'));
            }
            else {
                if(error.response.data.username !== undefined) {
                    errorTexts.push("Email may not be blank");
                }
                if(error.response.data.password !== undefined) {
                    errorTexts.push("Password may not be blank");
                }
                if(error.response.data.non_field_errors !== undefined) {
                    errorTexts.push(error.response.data.non_field_errors);
                }

                if(errorTexts.length)
                    dispatch(loginUserFailure(errorTexts.join('<br/>')));
                else
                    dispatch(loginUserFailure("Authentication Error"));
            }
        });
    };
}

/*
 * Sign up
 */

function signupUserFailure(errorText) {
    return {
        type: SIGNUP_USER_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function signupUser(email, username, password, confirm) {
    resetCookie();

    return dispatch => {
        if(email.trim() == "") {
            dispatch(signupUserFailure('Email may not be blank'));
            return;
        }
        if(username.trim() == "") {
            dispatch(signupUserFailure('Username may not be blank'));
            return;
        }
        else if(password.trim() == "") {
            dispatch(signupUserFailure('Password may not be blank'));
            return;
        }
        else if(password != confirm) {
            dispatch(signupUserFailure('Password doesn\'t match'));
            return;
        }

        dispatch({type: SIGNUP_USER_REQUEST });
        return axios({
            url: BASE_API_URL + 'auth/register/',
            method: 'post',
            responseType: 'json',
            data: {
                username: username.toLowerCase(), email: email.toLowerCase(), password: password
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('response', response);
            dispatch({type: SIGNUP_USER_SUCCESS, payload: response.data});
        })
        .catch((error) => {
            console.log(error);
            var errorTexts = [];
            if(error.response == undefined || error.response.data == undefined) {
                dispatch(signupUserFailure('We\'re sorry, something went wrong. Please try again.'));
            }
            else {
                if(error.response.data.email !== undefined) {
                    errorTexts.push(error.response.data.email);
                }
                if(error.response.data.username !== undefined) {
                    errorTexts.push(error.response.data.username);
                }
                if(error.response.data.non_field_errors !== undefined) {
                    errorTexts.push(error.response.data.non_field_errors);
                }

                if(errorTexts.length)
                    dispatch(signupUserFailure(errorTexts.join('<br/>')));
                else
                    dispatch(signupUserFailure("It has ben failed to sign up."));
            }

        });
    };
}

function forgotPasswordFailure(errorText) {
    return {
        type: FORGOT_PASSWORD_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function forgotPassword(email) {
    return dispatch => {
        if(email.trim() == "") {
            dispatch(forgotPasswordFailure('Email may not be blank'));
            return;
        }

        dispatch({ type: FORGOT_PASSWORD_REQUEST });
        return axios({
            url: BASE_API_URL + 'auth/password/reset/',
            method: 'post',
            responseType: 'json',
            data: {
                email: email
            }
        })
        .then((response) => {
            console.log('response', response);
            dispatch({ type: FORGOT_PASSWORD_SENT });
        })
        .catch((error) => {
            console.log(error);
            dispatch(forgotPasswordFailure('It has ben failed to send request.'));
        });
    };
}

function restPasswordFailure(errorText) {
    return {
        type: RESET_PASSWORD_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function resetPassword(password, confirm, uid, token) {
    return dispatch => {
        if(password.trim() == "") {
            dispatch(restPasswordFailure('Password may not be blank'));
            return;
        }
        else if(password != confirm) {
            dispatch(restPasswordFailure('Password doesn\'t match'));
            return;
        }

        dispatch({ type: RESET_PASSWORD_REQUEST });
        return axios({
            url: BASE_API_URL + 'auth/password/reset/confirm/',
            method: 'post',
            responseType: 'json',
            data: {
                new_password: password, re_new_password: confirm, uid: uid, token: token
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('response', response);
            dispatch({ type: RESET_PASSWORD_SUCCESS });
        })
        .catch((error) => {
            console.log(error.response.data);
            dispatch(restPasswordFailure('It has been failed to reset password.'));
        });
    };
}

function resetSignup() {
    return dispatch => {
        dispatch({
            type: SIGNUP_USER_RESET
        });
    };
}

module.exports = {
    resetAuth,
    logout,
    loginUser,
    signupUser,
    forgotPassword,
    resetPassword,
    setLoggedIn,
    resetSignup,
};
