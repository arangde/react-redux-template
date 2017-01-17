import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LogLifecycle from 'react-log-lifecycle';
import filesize from 'filesize';
import download from 'downloadjs';
import Pusher from 'react-pusher';

import actions from '../../redux/actions';
import { getArrayIndex } from '../../services/utils';

import {
  Row,
  Button,
  Col,
  Alert,
  DropdownButton,
  MenuItem,
  Modal,
} from '@sketchpixy/rubix';

import ProjectHeader from './project-header.jsx';
import ProjectAlert from './project-alert.jsx';
import VideoPlayer from '../common/video-player.jsx'

const flags = {
  // If logType is set to keys then the props of the object being logged
  // will be written out instead of the whole object. Remove logType or
  // set it to anything except keys to have the full object logged.
  logType: 'keys',
  // A list of the param "types" to be logged.
  // The example below has all the types.
  names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
};

class BuildOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {checked: false};
  }

  componentWillReceiveProps(nextProps) {
    const { allChecked } = nextProps;
    this.setState({checked: allChecked});
  }

  componentDidUpdate(prevProps, prevState) {
    const { checkItem, build } = this.props;
    checkItem(this.state.checked, build.id);
  }

  removeBuild() {
    if(confirm("Are you sure you want to delete this video build job?")) {
      const { build, projectId, dispatch } = this.props;
      dispatch(actions.removeBuild(projectId, build.id));
    }
  }

  handleBuildPlay = () => {
    let { build } = this.props;
    this.props.onPlayClick(build);
  }

  check(e) {
    this.setState({checked: e.target.checked});
  }

  render() {
    const { build, track, artwork, status, dispatch, onPlayClick } = this.props;
    const thumbnail = artwork && artwork.thumbnail? <img src={artwork.thumbnail} /> : <img src="/imgs/blank.gif" />;

    let title = '---- ----';
    let artist = '----';
    let duration = '00:00';

    if(track) {
      const metadata = JSON.parse(track.metadata).length ? JSON.parse(track.metadata)[0]: {};
      duration = metadata.duration? metadata.duration: '00:00';
      title = track.title? track.title: 'Untitled';
      artist = track.subtitle? track.subtitle: 'Unknown Artist';
    }

    let file_size = "----"

    if(build.file_size && build.file_size != "Unknown"){
      file_size = filesize(build.file_size)
    }

    return (
      <Row>
        <Col sm={12}><hr className="mt3 mb3 separator" /></Col>
        <Col sm={6} className="artwork">
          <Row>
            <Col sm={1}><input type="checkbox" onClick={::this.check} checked={this.state.checked}/></Col>
            <Col md={5}>
              <div className="preview">
                {build.status == 'complete'? <a href="javascript:;" onClick={::this.handleBuildPlay}>{ thumbnail }</a>: <span>{ thumbnail }</span>}
                <span className="duration">{duration}</span>
              </div>
            </Col>
            <Col md={6}>
              <span className="track-title">{title}</span>
              <span className="artist">{artist}</span>
              <span className="property"><b>Resolution: </b>{build.size}</span>
              <span className="property"><b>File Size: </b>{file_size}</span>
            </Col>
          </Row>
        </Col>
        <Col sm={2} className="text-capitalize text-center"><span>{ build.status }</span></Col>
        <Col sm={4} className="actions text-center">
          {build.status == 'complete'? <a href="javascript:;" onClick={::this.handleBuildPlay}>Play</a>: <span>Play</span>}&nbsp;&nbsp;&nbsp;
          {build.status == 'complete'? <a href={build.video_file} download>Download</a>: <span>Download</span>}&nbsp;&nbsp;&nbsp;
          {build.status == 'complete'? <span>Publish</span>: <span>Publish</span>}&nbsp;&nbsp;&nbsp;
          <a href="javascript:;" onClick={::this.removeBuild}>Delete</a>
        </Col>
      </Row>
    );
  }
}

class ProjectBuilds extends LogLifecycle {
  constructor(...args) {
    super(...args, flags);

    const projectId = this.props.params.projectId ? this.props.params.projectId : null;
    const filters = ['All', 'Pending', 'Queued', 'Processing', 'Building', 'Encoding', 'Complete', 'Failed', 'Locked'];
    this.state = { projectId: projectId, selectedFilter: 'all', filters: filters, loading: true, showModal: false, nowPlaying: null, allChecked: false, checkedIds: [], builds:[] };
  }

  componentWillMount() {
    const { dispatch, project, status } = this.props;

    if(this.state.projectId && (!project || this.state.projectId != project.id)) {
      dispatch(actions.getProject(this.state.projectId));
    }

    if(this.state.projectId) {
      dispatch(actions.getBuilds(this.state.projectId));
      dispatch(actions.getArtworks(this.state.projectId));
      dispatch(actions.getTracks(this.state.projectId));
    }
  }

  componentWillReceiveProps (nextProps) {
    const { status, project, builds } = nextProps;
    if (project) {
      this.setState({ projectId: project.id });
    }
    if(status == 'got' || status == 'deleted' ) {
      this.setState({builds: builds});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.checkedIds.length != nextState.checkedIds.length)
      return false;
    else
      return true;
  }

  onPusher(build) {
    const { builds } = this.state;
    const index = getArrayIndex(build.id, builds);
    if(index !== -1)
      this.setState({ builds: [...builds.slice(0, index), build, ...builds.slice(index + 1)] });
  }

  getArtwork = (id) => {
    const { artworks } = this.props;
    let obj = null;

    artworks.forEach(function(artwork) {
      if(artwork.id == id)
        obj = artwork;
    });

    return obj;
  }

  getTrack = (id) => {
    const { tracks } = this.props;
    let obj = null;

    tracks.forEach(function(track) {
      if(track.id == id)
        obj = track;
    });

    return obj;
  }

  refreshBuilds = () => {
    const { dispatch } = this.props;
    if(this.state.projectId) {
      dispatch(actions.getBuilds(this.state.projectId));
    }
  }

  changeFilter() {
    this.setState({ selectedFilter: this.refs.filters.value});
  }

  close() {
    this.setState({ showModal: false });
  }

  onPlayClick = (build) => {
    this.setState({ showModal: true, nowPlaying: build });
  }

  checkAll() {
    this.setState({allChecked: !this.state.allChecked});
  }

  checkItem(checked, id) {
    const { checkedIds } = this.state;
    const index = checkedIds.indexOf(id);

    if(checked) {
      if(index === -1) {
        this.setState({checkedIds: checkedIds.concat(id)});
      }
    }
    else {
      if(index !== -1) {
        this.setState({checkedIds: [...checkedIds.slice(0, index), ...checkedIds.slice(index + 1)]});
      }
    }
  }

  goAction() {
    const { dispatch, project } = this.props;
    const { checkedIds } = this.state;

    if(this.refs.actions.value == 'Delete') {
      if (checkedIds.length) {
        dispatch(actions.deleteBuilds(project.id, checkedIds));
      }
    }
  }

  render() {
    const { status, statusText, router, dispatch, loading } = this.props;
    const { selectedFilter, builds, filters, projectId, nowPlaying, allChecked } = this.state;

    let alert = null;
    let isLoading = false;
    let refresher = null;

    if(status == 'deleting') {
      alert = <Alert info>Deleting, please wait...</Alert>;
    } else if (status == 'getting') {
      isLoading = true;
    } else if (status == 'got') {

    }

    if(isLoading) {
      refresher = <button className="btn-link">...</button>;
    } else {
      refresher = <button onClick={::this.refreshBuilds} className="btn-link">Refresh</button>;
    }

    // Set up video player stuff
    let video_player = null;
    let video_track = null;
    let video_artwork = null;
    let video_poster = null;
    let video_title = null;
    let video_artist = null;
    let video_duration = null;

    if(nowPlaying) {
      video_track = this.getTrack(nowPlaying.track);
      video_artwork = this.getArtwork(nowPlaying.artwork);
      video_poster = video_artwork.thumbnail;
      // TODO: Determine aspect ratio from artwork shape
      video_player = <VideoPlayer nowPlaying={nowPlaying} poster={video_poster} />;

      if(video_track) {
        const video_metadata = JSON.parse(video_track.metadata).length ? JSON.parse(video_track.metadata)[0]: {};
        video_duration = video_metadata.duration ? video_metadata.duration: '00:00';
        video_title = video_metadata.title ? video_metadata.title: 'Untitled';
        video_artist = video_metadata.artist ? video_metadata.artist: 'Unknown Artist';
      }
    }

    return (
      <div id='body' className="project-body builds">
        <ProjectHeader router={ router } />

        <div className="body-sidebar__container">
          <div className="container__with-scroll">

            <Row>
              <Col sm={4}>
                <h3 className="mt0">Video Builds</h3>
              </Col>

              <Col sm={4} className="mt2 text-right">
                <span className="mr2">Actions: </span>
                <select className="status-filter" ref="actions">
                  <option key={0} value=""> ---- ---- ---- </option>
                  <option key={1} value="Delete">Delete</option>
                </select>
                <Button className="btn-white" onClick={::this.goAction}>Go</Button>
              </Col>
              <Col sm={4} className="mt2 text-right">
                <span className="mr2">Show: </span>
                <select className="status-filter" ref="filters" onChange={::this.changeFilter}>
                  { filters.map((filter, i) => { return <option key={i} value={filter.toLowerCase()}>{filter}</option> }) }
                </select>
                <Button className="btn-white" onClick={::this.refreshBuilds}>Refresh</Button>
              </Col>
            </Row>

            <hr className="mt0 separator" />

            <div id="alert-box">
              { alert }
            </div>

            {(() => {
                if (isLoading) {
                  return <Row>
                    <Col sm={12} className="text-center"><div className="loading"></div></Col>
                  </Row>
                } else {
                  if (builds.length) {
                    return <Row>
                      <Col sm={1} className="cell-header"><input type="checkbox" onClick={::this.checkAll} checked={allChecked}/></Col>
                      <Col sm={5} className="cell-header">Video Job</Col>
                      <Col sm={2} className="cell-header text-center">Status</Col>
                      <Col sm={4} className="cell-header text-center">Actions</Col>
                    </Row>
                  } else {
                    return <Row>
                      <Col sm={12} className="text-center text-danger zero-res">No video builds were found.</Col>
                    </Row>
                  }
                }
              })(this)
            }

            {((thisInstance) => {
              if(!isLoading) {
                return builds.map((build, i) => {
                  if(selectedFilter == 'all' || selectedFilter == build.status) {
                    const artwork = thisInstance.getArtwork(build.artwork);
                    const track = thisInstance.getTrack(build.track);
                    return <BuildOrder key={build.id} build={build} projectId={projectId} artwork={artwork} track={track}
                                       dispatch={dispatch} onPlayClick={this.onPlayClick} allChecked={allChecked}
                                       checkItem={(checked, id) => thisInstance.checkItem(checked, id)} />
                  }
                  else
                    return null;
                });
              }
            })(this)}
          </div>

          <Pusher channel="notifications" event="update-build-status" onUpdate={::this.onPusher} />

          <div className="body-sidebar__element pr5-imp pl5-imp">
            <h4 className="header">Helpful Tips</h4>
            <p>Here are some helpful tips to help you after your videos are ready.</p>
            <ul className="list-unstyled">
              <li><span className="color-primary">Publishing to YouTube</span></li>
              <li><span className="color-primary">Posting to Facebook</span></li>
              <li><span className="color-primary">How to Release on Twitter</span></li>
            </ul>
          </div>
        </div>

        <Modal id="build-modal" show={this.state.showModal} onHide={::this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{video_title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {video_player}
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={::this.close} className="btn-hollow btn-sq">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.build.status,
  statusText: state.build.statusText,
  project: state.project.project,
  builds: state.build.builds,
  loading: state.loading,
  tracks: state.tracks.tracks,
  artworks: state.artwork.artworks
});

export default connect(mapStateToProps)(ProjectBuilds);
