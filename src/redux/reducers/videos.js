/**
 * Created by jarosanger on 8/15/16.
 */
import { VIDEOS_FAILURE, GET_VIDEOS_REQUEST, ALL_VIDEOS, VIDEOS_REMOVE, LOGOUT_USER } from '../../constants';
import { getArrayIndex } from '../../services/utils';

const initialState = {
    statusText: null,
    status: null,
    videos: [],
};

function videos(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case VIDEOS_FAILURE:
            return Object.assign({}, state, {
                'status': 'failed',
                'statusText': action.payload.statusText
            });

        case GET_VIDEOS_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
            });

        case ALL_VIDEOS:
            return Object.assign({}, state, {
                'status': 'got',
                'videos': action.payload.videos
            });

        case VIDEOS_REMOVE:
            var index = getArrayIndex(action.payload.videoId, state.videos);
            var videos = state.videos;
            if (index !== -1)
                videos = [...state.videos.slice(0, index), ...state.videos.slice(index + 1)];

            return Object.assign({}, state, {
                'status': 'removed',
                'videos': videos,
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    videos,
};