/**
 * Created by jarosanger on 11/27/16.
 */
import { LOGOUT_USER, NOTIFICATIONS_FAILURE, NOTIFICATIONS_GET_REQUEST, NOTIFICATIONS_GET_SUCCESS,
    NOTIFICATIONS_DELETE_REQUEST, NOTIFICATIONS_DELETE_SUCCESS,
    NOTIFICATIONS_SAVE_REQUEST, NOTIFICATIONS_SAVE_SUCCESS } from '../../constants';
import { getArrayIndex } from '../../services/utils';

const initialState = {
    statusText: null,
    status: null,
    notifications: [],
    profileNotifications: [],
};

function notifications(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case NOTIFICATIONS_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'statusText': action.payload.statusText
            });
        case NOTIFICATIONS_GET_REQUEST:
            if(action.payload.type == 'profile') {
                return Object.assign({}, state, {
                    'status': 'getting',
                    'profileNotifications': []
                });
            }
            else {
                return Object.assign({}, state, {
                    'status': 'gettingHeader',
                    'notifications': []
                });
            }
        case NOTIFICATIONS_GET_SUCCESS:
            if(action.payload.type == 'profile') {
                return Object.assign({}, state, {
                    'status': 'got',
                    'profileNotifications': action.payload.notifications
                });
            }
            else {
                return Object.assign({}, state, {
                    'status': 'gotHeader',
                    'notifications': action.payload.notifications
                });
            }
        case NOTIFICATIONS_SAVE_REQUEST:
            return Object.assign({}, state, {
                'status': 'saving',
                'statusText': null,
            });
        case NOTIFICATIONS_SAVE_SUCCESS:
            if(action.payload.type == 'profile') {
                var index = getArrayIndex(action.payload.notification.id, state.profileNotifications);
                var notifications = [];
                if (index === -1)
                    notifications = [...state.profileNotifications];
                else
                    notifications = [...state.profileNotifications.slice(0, index), ...action.payload.notification, ...state.profileNotifications.slice(index + 1)];

                return Object.assign({}, state, {
                    'status': 'saved',
                    'profileNotifications': notifications,
                });
            }
            else {
                var index = getArrayIndex(action.payload.notification.id, state.notifications);
                var notifications = [];
                if (index === -1)
                    notifications = [...state.notifications];
                else
                    notifications = [...state.notifications.slice(0, index), ...action.payload.notification, ...state.notifications.slice(index + 1)];

                return Object.assign({}, state, {
                    'status': 'savedHeader',
                    'notifications': notifications,
                });
            }
        case NOTIFICATIONS_DELETE_REQUEST:
            return Object.assign({}, state, {
                'status': 'deleting',
                'statusText': null,
            });
        case NOTIFICATIONS_DELETE_SUCCESS:
            if(action.payload.type == 'profile') {
                var index = getArrayIndex(action.payload.notificationId, state.profileNotifications);
                var notifications = [];
                if (index === -1)
                    notifications = [...state.profileNotifications];
                else
                    notifications = [...state.profileNotifications.slice(0, index), ...state.profileNotifications.slice(index + 1)];

                return Object.assign({}, state, {
                    'status': 'deleted',
                    'profileNotifications': notifications,
                    'removedId': action.payload.notificationId
                });
            }
            else {
                var index = getArrayIndex(action.payload.notificationId, state.notifications);
                var notifications = [];
                if (index === -1)
                    notifications = [...state.notifications];
                else
                    notifications = [...state.notifications.slice(0, index), ...state.notifications.slice(index + 1)];

                return Object.assign({}, state, {
                    'status': 'deletedHeader',
                    'notifications': notifications,
                    'removedId': action.payload.notificationId
                });
            }
        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    notifications,
};