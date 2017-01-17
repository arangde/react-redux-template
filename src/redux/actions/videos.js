/**
 * Created by jarosanger on 8/15/16.
 */
import axios from 'axios';
import cookie from 'react-cookie';
import { BASE_API_URL, VIDEOS_FAILURE, GET_VIDEOS_REQUEST, ALL_VIDEOS, VIDEOS_REMOVE } from '../../constants';
import { sendApiRequest } from '../../services/requests';

function failVideos(errorText) {
    return {
        type: VIDEOS_FAILURE,
        payload: {
            statusText: errorText
        }
    }
}

function getVideosSuccess(videos) {
    return {
        type: ALL_VIDEOS,
        payload: {
            videos: videos
        }
    }
}

function getVideos() {
    return sendApiRequest({
        method: 'GET',
        url: 'projects/',
        before: { type: GET_VIDEOS_REQUEST },
        success: function(response) {
            return getVideosSuccess(response.data);
        },
        fail: function(errorData) {
            return failVideos('It has been failed to get videos.');
        }
    });
}

function removeVideo(videoId) {
    return dispatch => {
        dispatch({
            type: VIDEOS_REMOVE,
            payload: {
                videoId: videoId
            }
        });
    }
}

module.exports = {
    getVideos,
    removeVideo
};
