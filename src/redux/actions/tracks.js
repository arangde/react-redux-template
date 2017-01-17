/**
 * Created by jarosanger on 9/15/16.
 */
import cookie from 'react-cookie';
import { TRACKS_FAILURE, TRACKS_GET_REQUEST, TRACKS_GET_SUCCESS, TRACKS_SAVE_REQUEST, TRACKS_SAVE_SUCCESS,
    TRACKS_ADD_REQUEST, TRACKS_ADD_SUCCESS, TRACKS_DELETE_REQUEST, TRACKS_DELETE_SUCCESS, TRACKS_UPLOADING_SET } from '../../constants';
import { sendApiRequest } from '../../services/requests';

function failTracks(errorText) {
    return {
        type: TRACKS_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function tracksSaveSuccess(track) {
    return {
        type: TRACKS_SAVE_SUCCESS,
        payload: {
            track: track,
            statusText: 'Your track has been saved successfully!'
        }
    }
}

function tracksAddSuccess(track, fileId) {
    return {
        type: TRACKS_ADD_SUCCESS,
        payload: {
            track: track,
            fileId: fileId,
            statusText: 'Your track has been added successfully!'
        }
    }
}

function tracksDeleteSuccess(trackIds, multi=false) {
    return {
        type: TRACKS_DELETE_SUCCESS,
        payload: {
            trackIds: multi? trackIds: [trackIds]
        }
    }
}

function tracksGetSuccess(tracks) {
    return {
        type: TRACKS_GET_SUCCESS,
        payload: {
            tracks: tracks
        }
    }
}

function getTracks(projectId) {
    return sendApiRequest({
        method: 'GET',
        url: 'projects/' + projectId + '/tracks/',
        before: { type: TRACKS_GET_REQUEST },
        success: function(response) {
            return tracksGetSuccess(response.data);
        },
        fail: function(errorData) {
            return failTracks('It has been failed to get track files.');
        }
    });
}

function createTrack(projectId, file) {
    const userId = cookie.load('userId');
    const metadata = [{
        size: file.size, mimetype: file.mimetype
    }];

    return sendApiRequest({
        method: 'POST',
        url: 'projects/' + projectId + '/tracks/',
        data: { project: projectId, user: userId, audio_file: file.url, metadata: JSON.stringify(metadata), title: file.filename},
        before: { type: TRACKS_ADD_REQUEST },
        success: function(response) {
            return tracksAddSuccess(response.data, file.id);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failTracks(errorData.details);
            }
            else {
                return failTracks("It has been failed to create track.");
            }
        }
    });
}

function removeTrack(projectId, trackId) {
    return sendApiRequest({
        method: 'DELETE',
        url: 'projects/' + projectId + '/tracks/' + trackId + '/',
        before: { type: TRACKS_DELETE_REQUEST },
        success: function(response) {
            return tracksDeleteSuccess(trackId);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failTracks(errorData.details);
            }
            else {
                return failTracks("Failed to remove track.");
            }
        }
    });
}

function deleteTracks(projectId, trackIds) {
    return sendApiRequest({
        method: 'POST',
        url: 'projects/' + projectId + '/tracks/bulk/delete/',
        data: {track_ids: trackIds.join()},
        before: { type: TRACKS_DELETE_REQUEST },
        success: function(response) {
            return tracksDeleteSuccess(trackIds, true);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failTracks(errorData.details);
            }
            else {
                return failTracks("Failed to remove track.");
            }
        }
    });
}

function editTrack(track) {
    return sendApiRequest({
        method: 'PUT',
        url: 'projects/' + track.project + '/tracks/' + track.id + '/',
        data: track,
        before: { type: TRACKS_SAVE_REQUEST },
        success: function(response) {
            return tracksSaveSuccess(response.data);
        },
        fail: function(errorData) {
            if(errorData.details !== undefined) {
                return failTracks(errorData.details);
            }
            else {
                return failTracks("It has been failed to save track.");
            }
        }
    });
}

function setUploadings(uploadings) {
    return dispatch => {
        dispatch({
            type: TRACKS_UPLOADING_SET,
            payload: {
                uploadings: uploadings
            }
        });
    }
}

module.exports = {
    failTracks,
    getTracks,
    createTrack,
    editTrack,
    removeTrack,
    setUploadings,
    deleteTracks,
};
