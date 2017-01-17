/**
 * Created by jarosanger on 11/13/16.
 */
import cookie from 'react-cookie';
import { PROVIDERS_FAILURE, PROVIDERS_GET_REQUEST, PROVIDERS_GET_SUCCESS, PROVIDERS_CONNECT_REQUEST, PROVIDERS_CONNECT_SUCCESS,
    CONNECTS_ADD_REQUEST, CONNECTS_ADD_SUCCESS, CONNECTS_GET_REQUEST, CONNECTS_GET_SUCCESS,
    CONNECTS_SAVE_REQUEST, CONNECTS_SAVE_SUCCESS, CONNECTS_DELETE_REQUEST, CONNECTS_DELETE_SUCCESS } from '../../constants';
import { sendApiRequest, sendServerRequest } from '../../services/requests';

function failProviders(errorText) {
    return {
        type: PROVIDERS_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function providersGetSuccess(providers) {
    return {
        type: PROVIDERS_GET_SUCCESS,
        payload: {
            providers: providers
        }
    }
}

function connectsGetSuccess(connects) {
    return {
        type: CONNECTS_GET_SUCCESS,
        payload: {
            connects: connects
        }
    }
}

function connectsAddSuccess(data) {
    return {
        type: CONNECTS_ADD_SUCCESS,
        payload: {
            connect: data
        }
    }
}

function connectsSaveSuccess(connect) {
    return {
        type: CONNECTS_SAVE_SUCCESS,
        payload: {
            connect: connect
        }
    }
}

function connectsDeleteSuccess(connectId) {
    return {
        type: CONNECTS_DELETE_SUCCESS,
        payload: {
            connectId: connectId
        }
    }
}

function getProviders() {
    return sendApiRequest({
        method: 'GET',
        url: 'providers/',
        before: { type: PROVIDERS_GET_REQUEST },
        success: function(response) {
            return providersGetSuccess(response.data);
        },
        fail: function(errorData) {
            return failProviders('It has been failed to get providers.');
        }
    });
}

function getConnects() {
    const userId = cookie.load('userId');

    return sendApiRequest({
        method: 'GET',
        url: 'profile/connections/',
        before: { type: CONNECTS_GET_REQUEST },
        data: {user: userId},
        success: function(response) {
            return connectsGetSuccess(response.data);
        },
        fail: function(errorData) {
            return failProviders('It has been failed to get connects.');
        }
    });
}

function checkConnect(providerId, connectUser, connects) {
    let checked = false;
    connects.every(connect => {
        if(providerId == connect.provider && connectUser.id == connect.uid) {
            checked = true;
            return false;
        }
        else
            return true;
    });

    return checked;
}

function addConnect(providerId, connectUser, connects) {
    if(checkConnect(providerId, connectUser, connects)) {
        return dispatch => {
            dispatch(failProviders('Your account has already been added to ' + connectUser.provider));
        }
    }

    const userId = cookie.load('userId');
    return sendApiRequest({
        method: 'POST',
        url: 'profile/connections/',
        data: {user: userId, provider: providerId, uid: connectUser.id, extra_data: JSON.stringify(connectUser)},
        before: { type: CONNECTS_ADD_REQUEST },
        success: function(response) {
            return connectsAddSuccess(response.data);
        },
        fail: function(errorData) {
            return failProviders('It has been failed to connect ' + connectUser.provider);
        }
    });
}

function updateConnectedAccount(connectedAccount, data) {
    const userId = cookie.load('userId');
    data.userId = userId;

    return sendApiRequest({
        method: 'PUT',
        url: 'profile/connections/' + connectedAccount.id + '/',
        data: data,
        before: { type: CONNECTS_SAVE_REQUEST },
        success: function(response) {
            return connectsSaveSuccess(response.data);
        },
        fail: function(errorData) {
            return failProviders('It has been failed to update your account of ' + connectUser.provider);
        }
    });
}

function deleteConnectedAccount(connectedAccount) {
    return sendApiRequest({
        method: 'DELETE',
        url: 'profile/connections/' + connectedAccount.id + '/',
        before: { type: CONNECTS_DELETE_REQUEST },
        success: function(response) {
            return connectsDeleteSuccess(connectedAccount.id);
        },
        fail: function(errorData) {
            return failProviders('It has been failed to delete your account of ' + connectUser.provider);
        }
    });
}
module.exports = {
    getProviders,
    addConnect,
    getConnects,
    updateConnectedAccount,
    deleteConnectedAccount
};