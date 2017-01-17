/**
 * Created by jarosanger on 10/20/16.
 */
import { BUILD_RESET, BUILD_FAILURE, BUILD_CHECK_REQUEST, BUILD_CHECK_SUCCESS, BUILD_PROJECT_REQUEST,
    BUILD_TRACK_REQUEST, BUILD_TRACK_SUCCESS, BUILD_GET_REQUEST, BUILD_GET_SUCCESS, BUILD_TRACK_REMOVE,
    BUILD_ORDER_REQUEST, BUILD_ORDER_SUCCESS, BUILD_DELETE_REQUEST, BUILD_DELETE_SUCCESS } from '../../constants';
import { sendApiRequest } from '../../services/requests';
import cookie from 'react-cookie';

function buildFail(errorText) {
    return {
        type: BUILD_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function buildCheckSuccess() {
    return {
        type: BUILD_CHECK_SUCCESS
    }
}

function buildReset() {
    return {
        type: BUILD_RESET
    }
}

function buildTrackSuccess(data) {
    return {
        type: BUILD_TRACK_SUCCESS,
        payload: {
            data: data
        }
    }
}

function buildOrderSuccess(data) {
    return {
        type: BUILD_ORDER_SUCCESS,
        payload: {
            data: data
        }
    }
}

function buildGetRequest() {
    return {
        type: BUILD_GET_REQUEST,
        payload: {
          loading: true
        }
    }
}

function buildGetSuccess(builds) {
    return {
        type: BUILD_GET_SUCCESS,
        payload: {
            builds: builds,
            loading: false
        }
    }
}

function buildDeleteSuccess(buildIds, multi=false) {
    return {
        type: BUILD_DELETE_SUCCESS,
        payload: {
            buildIds: multi? buildIds: [buildIds],
            multi: multi
        }
    }
}

function checkBuilding() {
    return dispatch => {
        dispatch({
            type: BUILD_CHECK_REQUEST
        });
    }
}

function buildTrack(project, artwork, track, size, credits, buildOrder) {
    var data = {
        "user": project.user,
        "project": project.id,
        "track": track.id,
        "artwork": artwork.id,
        "settings": project.settings,
        "size": size,
        "status": "pending",
        "credits": credits,
        "build_order": buildOrder.id
    };

    return sendApiRequest({
        method: 'POST',
        url: 'projects/' + project.id + '/builds/',
        data: data,
        before: { type: BUILD_TRACK_REQUEST },
        success: function(response) {
            return buildTrackSuccess(response.data);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return buildFail(errorData.details);
            }
            else {
                return buildFail("It has been failed to build videos.");
            }
        }
    });
}

function removeBuild(projectId, buildId) {
    return sendApiRequest({
        method: 'DELETE',
        url: 'projects/' + projectId + '/builds/' + buildId + '/',
        before: { type: BUILD_DELETE_REQUEST },
        success: function(response) {
            return buildDeleteSuccess(buildId);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failBuild(errorData.details);
            }
            else {
                return failBuild("Failed to remove build.");
            }
        }
    });
}

function deleteBuilds(projectId, buildIds) {
    return sendApiRequest({
        method: 'POST',
        url: 'projects/' + projectId + '/builds/bulk/delete/',
        data: {build_ids: buildIds.join()},
        before: { type: BUILD_DELETE_REQUEST },
        success: function(response) {
            return buildDeleteSuccess(buildIds, true);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failBuild(errorData.details);
            }
            else {
                return failBuild("Failed to remove build.");
            }
        }
    });
}

function createBuildOrder(project) {
    const userId = cookie.load('userId');

    return sendApiRequest({
        method: 'POST',
        url: 'projects/' + project.id + '/build_orders/',
        data: {user: userId, project:project.id},
        before: { type: BUILD_ORDER_REQUEST },
        success: function(response) {
            return buildOrderSuccess(response.data);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return buildFail(errorData.details);
            }
            else {
                return buildFail("It has been failed to build videos.");
            }
        }
    });
}

function addBuildingTracks(project, artwork, tracks) {
    return dispatch => {
        const trackIds = [];
        tracks.forEach(function(track) {
            trackIds.push(track.id);
        });
        dispatch({
            type: BUILD_PROJECT_REQUEST,
            payload: {
                project: project.id,
                artwork: artwork.id,
                tracks: trackIds
            }
        });
    }
}

function getBuilds(projectId) {
    return sendApiRequest({
        method: 'GET',
        url: 'projects/' + projectId + '/builds/',
        before: function() {
          return buildGetRequest();
        },
        success: function(response) {
            return buildGetSuccess(response.data);
        },
        fail: function(errorData) {
            return buildFail('It has been failed to get track files.');
        }
    });
}

module.exports = {
    buildCheckSuccess,
    checkBuilding,
    removeBuild,
    addBuildingTracks,
    buildTrack,
    getBuilds,
    createBuildOrder,
    deleteBuilds
};
