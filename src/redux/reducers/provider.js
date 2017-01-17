/**
 * Created by jarosanger on 11/13/16.
 */
import { LOGOUT_USER, PROVIDERS_FAILURE, PROVIDERS_GET_REQUEST, PROVIDERS_GET_SUCCESS,
    CONNECTS_ADD_REQUEST, CONNECTS_ADD_SUCCESS, CONNECTS_GET_REQUEST, CONNECTS_GET_SUCCESS,
    CONNECTS_SAVE_REQUEST, CONNECTS_SAVE_SUCCESS, CONNECTS_DELETE_REQUEST, CONNECTS_DELETE_SUCCESS } from '../../constants';
import { getArrayIndex } from '../../services/utils';

const initialState = {
    status: null,
    statusText: null,
    providers: [],
    connects: []
};

function provider(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case PROVIDERS_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'statusText': action.payload.statusText
            });

        case PROVIDERS_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
                'statusText': null
            });

        case PROVIDERS_GET_SUCCESS:
            return Object.assign({}, state, {
                'status': 'got',
                'statusText': null,
                'providers': action.payload.providers
            });

        case CONNECTS_ADD_REQUEST:
            return Object.assign({}, state, {
                'status': 'adding',
                'statusText': null
            });

        case CONNECTS_ADD_SUCCESS:
            var connects = state.connects.concat([]);
            var index = getArrayIndex(action.payload.connect.id, connects);

            if (index === -1)
                connects.push(action.payload.connect);
            else
                connects[index] = action.payload.connect;
            return Object.assign({}, state, {
                'status': 'added',
                'connects': connects,
                'statusText': "Your account has been added successfully!"
            });

        case CONNECTS_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'gettingConnects',
                'statusText': null
            });

        case CONNECTS_GET_SUCCESS:
            return Object.assign({}, state, {
                'status': 'gotConnects',
                'statusText': null,
                'connects': action.payload.connects
            });

        case CONNECTS_SAVE_REQUEST:
            return Object.assign({}, state, {
                'status': 'saving',
                'statusText': null,
            });

        case CONNECTS_SAVE_SUCCESS:
            var connects = state.connects.concat([]);
            var index = getArrayIndex(action.payload.connect.id, connects);
            if (index === -1)
                connects.push(action.payload.connect);
            else
                connects[index] = action.payload.connect;
            return Object.assign({}, state, {
                'status': 'saved',
                'statusText': action.payload.statusText,
                'connects': connects
            });

        case CONNECTS_DELETE_REQUEST:
            return Object.assign({}, state, {
                'status': 'deleting',
                'statusText': null,
            });

        case CONNECTS_DELETE_SUCCESS:
            var connects = state.connects.concat([]);
            var index = getArrayIndex(action.payload.connectId, connects);
            if (index !== -1)
                connects.splice(index, 1);
            return Object.assign({}, state, {
                'status': 'deleted',
                'statusText': action.payload.statusText,
                'connects': connects
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    provider,
};