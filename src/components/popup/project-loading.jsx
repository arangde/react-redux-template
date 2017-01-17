import React from 'react';
import { connect } from 'react-redux';
import ReactTimeout from 'react-timeout';

import actions from '../../redux/actions';
import {
    Modal
} from '@sketchpixy/rubix';

class ProjectLoading extends React.Component {

  componentWillMount () {
    const {status, project, dispatch} = this.props;

    if (status == 'checking') {
      dispatch(actions.getArtworks(project.id));
      dispatch(actions.getTracks(project.id));
    }
  }

  componentWillReceiveProps (nextProps) {
    const {project, router, dispatch} = this.props;
    const prevStatus = this.props.status;
    const {status, trackStatus, tracks, artworkStatus, artworks} = nextProps;

    if(status == 'builtAll') {
      router.push('/popup/build-success');
    }
    else if(prevStatus == 'processing' && status == 'failed') {
      router.push('/project/' + project.id + '/build-order');
    }
    else if(status == 'checked') {
      this.props.setTimeout(() => {
        router.push('/project/' + project.id + '/build-order');
      }, 3000);
    }
    else if(artworkStatus == 'saved') {
      router.push(`/project/${project.id}`);
    }
    else if(prevStatus == 'checking' && artworkStatus == 'got' && trackStatus == 'got') {
      let checked = false;
      if(artworkStatus == 'got') {
        if(artworks.length == 0) {
          router.push('/project/' + project.id);
          dispatch(actions.failArtwork("You need to add artwork to build video."));
          return;
        }
        else {
          artworks.every(function(artwork) {
            if(artwork.thumbnail) {
              checked = true;
              return false;
            }
            else
              return true;
          });
          if(!checked) {
            router.push('/project/' + project.id);
            dispatch(actions.failArtwork("You need to add artwork with valid thumbnail to build video."));
            return;
          }
        }
      }
      else if(trackStatus == 'got') {
        if(tracks.length == 0) {
          router.push('/project/' + project.id + '/audio');
          dispatch(actions.failTracks("You need to add tracks to build video."));
          return;
        }
        else {
          checked = true;
          tracks.every(function(track) {
            if(!track.audio_file) {
              checked = false;
              return false;
            }
            else
              return true;
          });
          if(!checked) {
            router.push('/project/' + project.id);
            dispatch(actions.failTracks("You need to add tracks with valid audio file to build video."));
            return;
          }
        }
      }

      if(checked) {
        dispatch(actions.buildCheckSuccess());
      }
      else {
        router.push('/project/' + project.id);
        dispatch(actions.failArtwork("It has been failed to check build validation."));
      }
    }
  }

  render() {
    const { statusText, artworkStatus } = this.props;

    let loadingText = statusText;
    if(artworkStatus == 'saving')
      loadingText = 'Generating artwork...';

    return (
      <div className="modal-wrapper project-loading">
        <div className="modal-content wide hollow">
          <Modal.Body className="text-center">
            <div className="loading"></div>
            <h3>{ loadingText }</h3>
          </Modal.Body>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusText: state.build.statusText,
  status: state.build.status,
  project: state.project.project,
  trackStatus: state.tracks.status,
  tracks: state.tracks.tracks,
  artworkStatus: state.artwork.status,
  artworks: state.artwork.artworks,
});

export default connect(mapStateToProps)(ReactTimeout(ProjectLoading));
