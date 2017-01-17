/**
 * Created by jarosanger on 9/15/16.
 */
import { LOGOUT_USER, PROJECT_FAILURE, PROJECT_RESET, PROJECT_SAVE_REQUEST, PROJECT_SAVE_SUCCESS,
    PROJECT_DELETE_REQUEST, PROJECT_DELETE_SUCCESS, PROJECT_SET_SUCCESS,
    PROJECT_GET_REQUEST, PROJECT_GET_SUCCESS, PROJECT_SET_THUMBNAIL } from '../../constants';

const initialState = {
    statusText: null,
    status: null,
    project: null,
};

function project(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case PROJECT_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'statusText': action.payload.statusText
            });
        case PROJECT_RESET:
            return Object.assign({}, initialState);
        case PROJECT_SAVE_REQUEST:
            return Object.assign({}, state, {
                'status': 'saving'
            });
        case PROJECT_SAVE_SUCCESS:
            return Object.assign({}, state, {
                'status': 'saved',
                'statusText': action.payload.statusText,
                'project': action.payload.project
            });
        case PROJECT_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
            });
        case PROJECT_GET_SUCCESS:
            return Object.assign({}, state, {
                'status': 'got',
                'project': action.payload.project
            });
        case PROJECT_SET_SUCCESS:
            return Object.assign({}, state, {
                'project': action.payload.project
            });
        case PROJECT_DELETE_REQUEST:
            return Object.assign({}, state, {
                'status': 'deleting',
            });
        case PROJECT_DELETE_SUCCESS:
            return Object.assign({}, state, {
                'status': 'deleted',
                'statusText': action.payload.statusText,
                'projectId': action.payload.projectId
            });
        case PROJECT_SET_THUMBNAIL:
            const project = Object.assign({}, state.project, {
                'thumbnail': action.payload.thumbnail
            });
            return Object.assign({}, state, {
                'project': project
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    project,
};