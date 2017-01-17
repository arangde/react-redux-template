/**
 * Created by jarosanger on 9/15/16.
 */
import { LOGOUT_USER, TRACKS_FAILURE, TRACKS_RESET, TRACKS_GET_REQUEST, TRACKS_GET_SUCCESS,
    TRACKS_SAVE_REQUEST, TRACKS_SAVE_SUCCESS, TRACKS_ADD_REQUEST, TRACKS_ADD_SUCCESS,
    TRACKS_DELETE_REQUEST, TRACKS_DELETE_SUCCESS, TRACKS_UPLOADING_SET } from '../../constants';
import { getArrayIndex } from '../../services/utils';

const initialState = {
    statusText: null,
    status: null,
    tracks: [],
    uploadings: [],
};

function tracks(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case TRACKS_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'statusText': action.payload.statusText
            });
        case TRACKS_RESET:
            return Object.assign({}, initialState);
        case TRACKS_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
                'tracks': []
            });
        case TRACKS_GET_SUCCESS:
            return Object.assign({}, state, {
                'status': 'got',
                'tracks': action.payload.tracks
            });
        case TRACKS_ADD_REQUEST:
            return Object.assign({}, state, {
                'status': 'adding',
                'statusText': null,
            });
        case TRACKS_ADD_SUCCESS:
            var tracks = state.tracks.concat([]);
            var uploadings = state.uploadings.concat([]);
            const index = getArrayIndex(action.payload.fileId, uploadings);

            if(action.payload.track) {
                tracks.push(action.payload.track);
            }
            if(index !== -1) {
                uploadings.splice(index, 1);
            }
            return Object.assign({}, state, {
                'status': 'added',
                'statusText': action.payload.statusText,
                'fileId': action.payload.fileId,
                'tracks': tracks,
                'uploadings': uploadings
            });
        case TRACKS_SAVE_REQUEST:
            return Object.assign({}, state, {
                'status': 'saving',
                'statusText': null,
            });
        case TRACKS_SAVE_SUCCESS:
            var index = getArrayIndex(action.payload.track.id, state.tracks);
            var tracks = state.tracks.concat([]);
            if (index === -1)
                tracks.push(action.payload.track);
            else
                tracks[index] = action.payload.track;
            return Object.assign({}, state, {
                'status': 'saved',
                'statusText': action.payload.statusText,
                'tracks': tracks
            });
        case TRACKS_DELETE_REQUEST:
            return Object.assign({}, state, {
                'status': 'deleting',
                'statusText': null,
            });
        case TRACKS_DELETE_SUCCESS:
            let tracks = [...state.tracks];
            action.payload.trackIds.forEach((trackId) => {
                const index = getArrayIndex(trackId, tracks);
                if(index !== -1)
                    tracks = [...tracks.slice(0, index), ...tracks.slice(index + 1)];
            });
            return Object.assign({}, state, {
                'status': 'deleted',
                'tracks': tracks,
                'removedTrackIds': action.payload.trackIds
            });
        case TRACKS_UPLOADING_SET:
            return Object.assign({}, state, {
                'status': 'setUploadings',
                'statusText': null,
                'uploadings': [...action.payload.uploadings],
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    tracks,
};