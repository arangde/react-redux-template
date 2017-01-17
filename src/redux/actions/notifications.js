/**
 * Created by jarosanger on 11/27/16.
 */
import { NOTIFICATIONS_FAILURE, NOTIFICATIONS_GET_REQUEST, NOTIFICATIONS_GET_SUCCESS,
    NOTIFICATIONS_DELETE_REQUEST, NOTIFICATIONS_DELETE_SUCCESS,
    NOTIFICATIONS_SAVE_REQUEST, NOTIFICATIONS_SAVE_SUCCESS } from '../../constants';
import { sendApiRequest } from '../../services/requests';

function failNotifications(errorText) {
    return {
        type: NOTIFICATIONS_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function getNotificationsSuccess(cmdType, notifications) {
    return {
        type: NOTIFICATIONS_GET_SUCCESS,
        payload: {
            cmdType: cmdType,
            notifications: notifications
        }
    }
}

function saveNotificationsSuccess(cmdType, notification) {
    return {
        type: NOTIFICATIONS_SAVE_SUCCESS,
        payload: {
            cmdType: cmdType,
            notification: notification
        }
    }
}

function removeNotificationsSuccess(cmdType, notificationId) {
    return {
        type: NOTIFICATIONS_DELETE_SUCCESS,
        payload: {
            cmdType: cmdType,
            notificationId: notificationId
        }
    }
}

function getNotifications(cmdType) {
    const url = cmdType=='profile'? 'profile/notifications/': 'notifications/';

    return sendApiRequest({
        method: 'GET',
        url: url,
        before: { type: NOTIFICATIONS_GET_REQUEST, payload: { cmdType: cmdType } },
        success: function(response) {
            return getNotificationsSuccess(cmdType, response.data);
        },
        fail: function(errorData) {
            return failNotifications('It has been failed to get notifications.');
        }
    });
}

function updateNotification(cmdType, notification, options) {
    const url = cmdType=='profile'? 'profile/notifications/' + notification.id + '/': 'notifications/' + notification.id + '/';
    options.user = notification.user;

    return sendApiRequest({
        method: 'PUT',
        url: url,
        data: options,
        before: { type: NOTIFICATIONS_SAVE_REQUEST, payload: { cmdType: cmdType } },
        success: function(response) {
            return saveNotificationsSuccess(cmdType, response.data);
        },
        fail: function(errorData) {
            return failNotifications('It has been failed to save notification.');
        }
    });
}

function removeNotification(cmdType, notificationId) {
    const url = cmdType=='profile'? 'profile/notifications/' + notificationId + '/': 'notifications/' + notificationId + '/';

    return sendApiRequest({
        method: 'DELETE',
        url: url,
        before: { type: NOTIFICATIONS_DELETE_REQUEST, payload: { cmdType: cmdType } },
        success: function(response) {
            return removeNotificationsSuccess(cmdType, notificationId);
        },
        fail: function(errorData) {
            return failNotifications('It has been failed to remove notification.');
        }
    });
}

module.exports = {
    getNotifications,
    updateNotification,
    removeNotification,
};
