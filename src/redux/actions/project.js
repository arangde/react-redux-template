/**
 * Created by jarosanger on 9/15/16.
 */
import cookie from 'react-cookie';
import { PROJECT_FAILURE, PROJECT_SAVE_REQUEST, PROJECT_SAVE_SUCCESS,
    PROJECT_DELETE_REQUEST, PROJECT_DELETE_SUCCESS,
    PROJECT_GET_REQUEST, PROJECT_GET_SUCCESS, PROJECT_SET_SUCCESS,
    PROJECT_RESET, ARTWORK_RESET, TRACKS_RESET, BUILD_RESET } from '../../constants';
import { sendApiRequest } from '../../services/requests';

function failProject(errorText) {
    return {
        type: PROJECT_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function projectSaveSuccess(project) {
    return {
        type: PROJECT_SAVE_SUCCESS,
        payload: {
            project: project,
            statusText: 'Your project has been saved successfully!'
        }
    }
}

function projectDeleteSuccess(projectId) {
    return {
        type: PROJECT_DELETE_SUCCESS,
        payload: {
            statusText: 'Your project has been deleted successfully!',
            projectId: projectId
        }
    }
}

function projectGetSuccess(project) {
    return {
        type: PROJECT_GET_SUCCESS,
        payload: {
            project: project
        }
    }
}

function createProject(title) {
    const userId = cookie.load('userId');
    return sendApiRequest({
        method: 'POST',
        url: 'projects/',
        data: { user: userId, title: title, settings: "[]" },
        before: { type: PROJECT_SAVE_REQUEST },
        success: function(response) {
            return projectSaveSuccess(response.data);
        },
        fail: function(errorData) {
            return failProject('It has been failed to create project.');
        }
    });
}

function editProject(projectId, title) {
    const userId = cookie.load('userId');
    return sendApiRequest({
        method: 'PATCH',
        url: 'projects/' + projectId + '/',
        data: { user: userId, title: title },
        before: { type: PROJECT_SAVE_REQUEST },
        success: function(response) {
            return projectSaveSuccess(response.data);
        },
        fail: function(errorData) {
            return failProject('It has been failed to edit project.');
        }
    });
}

function getProject(projectId) {
    return sendApiRequest({
        method: 'GET',
        url: 'projects/' + projectId + '/',
        before: { type: PROJECT_GET_REQUEST },
        success: function(response) {
            return projectGetSuccess(response.data);
        },
        fail: function(errorData) {
            return failProject("Project not found.");
        }
    });
}

function deleteProject(projectId) {
    return sendApiRequest({
        method: 'DELETE',
        url: 'projects/' + projectId + '/',
        before: { type: PROJECT_DELETE_REQUEST },
        success: function(response) {
            return projectDeleteSuccess(projectId);
        },
        fail: function(errorData) {
            return failProject('Failed to delete project.');
        }
    });
}

function setProject(project) {
    return dispatch => {
        dispatch({
            type: PROJECT_SET_SUCCESS,
            payload: {
                project: project
            }
        });
        dispatch({
            type: ARTWORK_RESET
        });
        dispatch({
            type: TRACKS_RESET
        });
        dispatch({
            type: BUILD_RESET
        });
    }
}

function resetProject() {
    return dispatch => {
        dispatch({
            type: PROJECT_RESET
        });
        dispatch({
            type: ARTWORK_RESET
        });
        dispatch({
            type: TRACKS_RESET
        });
        dispatch({
            type: BUILD_RESET
        });
    }
}

function saveProjectSettings(projectId, watermark, settings) {
    const userId = cookie.load('userId');
    return sendApiRequest({
        method: 'PATCH',
        url: 'projects/' + projectId + '/',
        data: { user: userId, watermark: watermark, settings: settings },
        before: { type: PROJECT_SAVE_REQUEST },
        success: function(response) {
            return projectSaveSuccess(response.data);
        },
        fail: function(errorData) {
            return failProject('It has been failed to save project settings.');
        }
    });
}

function saveProjectWatermark(projectId, watermark) {
    const userId = cookie.load('userId');
    return sendApiRequest({
        method: 'PATCH',
        url: 'projects/' + projectId + '/',
        data: { user: userId, watermark: watermark },
        before: { type: PROJECT_SAVE_REQUEST },
        success: function(response) {
            return projectSaveSuccess(response.data);
        },
        fail: function(errorData) {
            return failProject('It has been failed to save watermark.');
        }
    });
}

module.exports = {
    resetProject,
    createProject,
    getProject,
    editProject,
    deleteProject,
    setProject,
    saveProjectSettings,
    saveProjectWatermark,
};
