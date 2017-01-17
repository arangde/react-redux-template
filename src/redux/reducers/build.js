/**
 * Created by jarosanger on 8/15/16.
 */
import { LOGOUT_USER, BUILD_FAILURE, BUILD_RESET, BUILD_CHECK_REQUEST, BUILD_CHECK_SUCCESS, BUILD_PROJECT_REQUEST,
    BUILD_TRACK_REQUEST, BUILD_TRACK_SUCCESS, BUILD_GET_REQUEST, BUILD_GET_SUCCESS, BUILD_TRACK_REMOVE,
    BUILD_ORDER_REQUEST, BUILD_ORDER_SUCCESS, BUILD_DELETE_REQUEST, BUILD_DELETE_SUCCESS } from '../../constants';

import { getArrayIndex } from '../../services/utils';

const initialState = {
    status: null,
    statusText: null,
    builds: [],
    building: null,
    loading: true,
    buildOrder: null,
};

function build(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_USER:
            return Object.assign({}, initialState);

        case BUILD_RESET:
            return Object.assign({}, initialState);
        case BUILD_CHECK_REQUEST:
            return Object.assign({}, state, {
                'status': 'checking',
                'statusText': 'Performing build check...'
            });
        case BUILD_CHECK_SUCCESS:
            return Object.assign({}, state, {
                'status': 'checked'
            });
        case BUILD_PROJECT_REQUEST:
            return Object.assign({}, state, {
                'status': 'processing',
                'statusText': 'Processing build order...',
                'building': action.payload
            });
        case BUILD_TRACK_SUCCESS:
            let tracks = state.building.tracks;
            const index = tracks.indexOf(action.payload.data.track);
            if(index != -1)
                tracks.splice(index, 1);
            if(tracks.length == 0)
                return Object.assign({}, state, {
                    'status': 'builtAll',
                    'building': null
                });
            else
                return Object.assign({}, state, {
                    'status': 'built',
                    'building': Object.assign({}, state.building, {tracks: tracks})
                });
        case BUILD_GET_REQUEST:
            return Object.assign({}, state, {
                'status': 'getting',
                'builds': [],
                'loading': action.payload.loading
            });
        case BUILD_GET_SUCCESS:
            return Object.assign({}, state, {
                'status': 'got',
                'builds': action.payload.builds,
                'loading': action.payload.loading
            });

        case BUILD_DELETE_REQUEST:
            return Object.assign({}, state, {
                'status': 'deleting',
            });

        case BUILD_DELETE_SUCCESS:
            let builds = [...state.builds];
            action.payload.buildIds.forEach((buildId) => {
                const index = getArrayIndex(buildId, builds);
                if(index !== -1)
                    builds = [...builds.slice(0, index), ...builds.slice(index + 1)];
            });
            return Object.assign({}, state, {
                'status': 'deleted',
                'builds': builds
            });

        case BUILD_ORDER_REQUEST:
            return Object.assign({}, state, {
                'status': 'buildOrdering',
            });

        case BUILD_ORDER_SUCCESS:
            return Object.assign({}, state, {
                'status': 'buildOrdered',
                'buildOrder': action.payload.data
            });

        default:
            return Object.assign({}, state);
    }
}

module.exports = {
    build,
};
