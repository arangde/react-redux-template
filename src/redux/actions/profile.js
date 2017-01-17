/**
 * Created by jarosanger on 8/15/16.
 */
import axios from 'axios';
import cookie from 'react-cookie';
import { BASE_API_URL, SETTINGS_FAILURE, GET_USER, USER_FAIL, SET_AVATAR,
    SETTINGS_GET_REQUEST, SETTINGS_GET_SUCCESS, SETTINGS_SAVE_REQUEST, SETTINGS_SAVE_SUCCESS } from '../../constants';
import { checkHttpStatus } from '../../services/utils';
import { sendApiRequest } from '../../services/requests';

function failSettings(cmdType, errorText) {
    if(cmdType == 'user') {
        return {
            type: USER_FAIL,
            payload: {
                statusText: errorText
            }
        }
    }
    return {
        type: SETTINGS_FAILURE,
        payload: {
            cmdType: cmdType,
            statusText: errorText
        }
    }
}

function settingsGetSuccess(cmdType, data) {
    if(cmdType == 'profile') {
        cookie.save('fullName', data.full_name, { path: '/' });
        return {
            type: SETTINGS_GET_SUCCESS,
            payload: {
                cmdType: cmdType,
                data: data
            }
        }
    }
    else if(cmdType == 'user') {
        cookie.save('email', data.email, { path: '/' });
        cookie.save('userId', data.id, { path: '/' });
        return {
            type: GET_USER,
            payload: {
                data: data
            }
        }
    }
}

function settingsSaveSuccess(cmdType, data) {
    if(cmdType == 'profile' && data.full_name) {
        cookie.save('fullName', data.full_name, { path: '/' });
    }
    else if(cmdType == 'user') {
        cookie.save('email', data.email, { path: '/' });
        cookie.save('userId', data.id, { path: '/' });
        return {
            type: GET_USER,
            payload: {
                data: data
            }
        }
    }

    data.statusText = 'You have successfully saved data.';
    if(data.details) {
        data.statusText = data.details;
    }
    return {
        type: SETTINGS_SAVE_SUCCESS,
        payload: {
            cmdType: cmdType,
            data: data
        }
    }
}

function getSettings(cmdType, callback) {

    return dispatch => {

        const token = cookie.load('token');
        if(!token) {
            dispatch(failSettings(cmdType, 'Authentication token is empty.'));

            if(callback)
                callback(new Error('Authentication token is empty.'));
            else
                return;
        }

        dispatch({ type: SETTINGS_GET_REQUEST });

        var url = 'profile/';
        switch (cmdType) {
            case 'profile':
                url = 'profile/';
                break;
            case 'email':
                url = 'profile/email/';
                break;
            case 'user':
                url = 'user/';
                break;
            default:
                break;
        };

        return axios({
            url: BASE_API_URL + url,
            method: 'get',
            responseType: 'json',
            headers: {
                'Authorization': 'Token ' + token
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('response', cmdType, response);
            dispatch(settingsGetSuccess(cmdType, response.data));

            if(callback)
                callback(null, response.data);
        })
        .catch((error) => {
            console.log(cmdType, error);

            dispatch(failSettings(cmdType, 'It has been failed to get profile.'));

            if(callback)
                callback(new Error('It has been failed to get profile.'));
        });
    };
}

function saveSettings(cmdType, settings) {
    return dispatch => {
        const token = cookie.load('token');
        if(!token) {
            dispatch(failSettings(cmdType, 'Authentication token is empty.'));
            return;
        }
        dispatch({ type: SETTINGS_SAVE_REQUEST, payload: { cmdType: cmdType, data: settings } });

        var url = 'profile/';
        var method = 'put';
        switch (cmdType) {
            case 'profile':
                url = 'profile/';
                settings.user = cookie.load('userId');
                break;
            case 'email':
                url = 'profile/email/';
                break;
            case 'password':
                url = 'profile/password/';
                method = 'post';
                break;
            default:
                break;
        };

        return axios({
            url: BASE_API_URL + url,
            method: method,
            responseType: 'json',
            data: settings,
            headers: {
                'Authorization': 'Token ' + token
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('response', response);
            dispatch(settingsSaveSuccess(cmdType, response.data));
        })
        .catch((error) => {
            console.error(error.response.data);
            var errorTexts = [];
            if(error.response == undefined) {
                dispatch(failSettings(cmdType, 'It has been failed to save.'));
            }
            else if(error.response.data == undefined) {
                dispatch(failSettings(cmdType, 'It has been failed to save.'));
            }
            else {
                if(error.response.data.full_name !== undefined) {
                    errorTexts.push(error.response.data.full_name);
                }
                if(error.response.data.language !== undefined) {
                    errorTexts.push(error.response.data.language);
                }
                if(error.response.data.email !== undefined) {
                    errorTexts.push(error.response.data.email);
                }
                if(error.response.data.mugshot !== undefined) {
                    errorTexts.push(error.response.data.mugshot);
                }
                if(error.response.data.non_field_errors !== undefined) {
                    errorTexts.push(error.response.data.non_field_errors);
                }

                if(errorTexts.length)
                    dispatch(failSettings(cmdType, errorTexts.join('<br/>')));
                else
                    dispatch(failSettings(cmdType, 'It has been failed to save.'));
            }

        });
    };
}

function getUser() {
    return getSettings('user');
}

function getProfile() {
    return getSettings('profile');
}

function setAvatar(mugshot) {
    return dispatch => {
        dispatch({
            type: SET_AVATAR,
            payload: {
                mugshot: mugshot
            }
        });
    }
}

module.exports = {
    saveSettings,
    getSettings,
    getUser,
    getProfile,
    setAvatar,
};