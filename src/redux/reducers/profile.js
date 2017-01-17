/**
 * Created by jarosanger on 8/15/16.
 */
import { LOGOUT_USER, SETTINGS_FAILURE, SET_AVATAR, SETTINGS_GET_REQUEST, SETTINGS_GET_SUCCESS,
    SETTINGS_SAVE_REQUEST, SETTINGS_SAVE_SUCCESS } from '../../constants';

const initialState = {
    cmdType: null,
    status: null,
    statusText: null,
    fullName: '',
    language: '',
    email: null,
    mugshot: null,
};

function profile(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case SETTINGS_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'cmdType': action.payload.cmdType,
                'statusText': action.payload.statusText
            });

        case SETTINGS_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
                'statusText': null
            });

        case SETTINGS_GET_SUCCESS:
            return Object.assign({}, state, action.payload.data, {
                'status': 'got',
                'cmdType': action.payload.cmdType,
                'statusText': action.payload.data.statusText,
                'fullName': action.payload.data.full_name
            });

        case SETTINGS_SAVE_REQUEST:
            return Object.assign({}, state, action.payload.data, {
                'status': 'saving',
                'statusText': null,
                'fullName': action.payload.data.full_name
            });

        case SETTINGS_SAVE_SUCCESS:
            return Object.assign({}, state, action.payload.data, {
                'status': 'saved',
                'cmdType': action.payload.cmdType,
                'statusText': action.payload.data.statusText,
                'fullName': action.payload.data.full_name
            });

        case SET_AVATAR:
            return Object.assign({}, state, {
                mugshot: action.payload.mugshot
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    profile,
};