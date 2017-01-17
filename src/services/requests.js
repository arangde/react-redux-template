/**
 * Created by jarosanger on 11/13/16.
 */
import axios from 'axios';
import cookie from 'react-cookie';

import { SERVER_URL, BASE_API_URL } from '../constants';
import { checkHttpStatus } from './utils';

export function sendApiRequest(options) {
    return dispatch => {
        const token = cookie.load('token');
        if(!token) {
            dispatch(options.fail('Authentication token is empty.'));
            return;
        }
        if(options.before) {
            if(typeof(options.before) == 'function') {
                dispatch(options.before());
            }
            else {
                dispatch(options.before);
            }
        }

        return axios({
            url: BASE_API_URL + options.url,
            method: options.method,
            data: options.data,
            responseType: 'json',
            headers: {
                'Authorization': 'Token ' + token
            }
        })
        .then(checkHttpStatus)
        .then((response) => {
            console.log('response', response);
            dispatch(options.success(response));

            if(options.successAfter) {
                dispatch(options.successAfter(response));
            }
        })
        .catch((error) => {
            if(error.response && error.response.data) {
                console.error(error.response.data);
                dispatch(options.fail(error.response.data));
            }
            else {
                console.error(error);
                dispatch(options.fail(error));
            }
        });
    };
}

export function sendServerRequest(options, callback) {
    return axios({
        url: SERVER_URL + options.url,
        method: options.method,
        data: options.data,
        responseType: 'json',
    })
    .then((response) => {
        console.log('response', response);
        callback(null, response.data);
    })
    .catch((error) => {
        if(error.response && error.response.data) {
            console.error(error.response.data);
        }
        else {
            console.error(error);
        }
        callback(error);
    });
}