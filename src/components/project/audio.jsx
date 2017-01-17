import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { FILEPICKER_KEY } from '../../constants';
import actions from '../../redux/actions';
import { getArrayIndex } from '../../services/utils';

import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Row,
    Col,
    Button,
    Alert,
    Progress
} from '@sketchpixy/rubix';

import ProjectHeader from './project-header.jsx';
import ProjectAlert from './project-alert.jsx';
import AudioTrack from './audio-track.jsx';

class RowUploading extends React.Component {
  render() {
    const { file, rowIndex, closer } = this.props;
    return (
      <tr>
        <td>&nbsp;</td>
        <td className="text-center"><span className="rubix-icon icon-fontello-play-1"></span></td>
        <td className="text-center">{rowIndex + 1}</td>
        <td>---- ----</td>
        <td>----</td>
        <td className="text-center">--</td>
        <td className="text-right">
          <Button bsStyle="link" className="pl1-imp pr1-imp pull-right" onClick={closer}><span className="rubix-icon icon-ikons-close"></span></Button>
          <Progress striped active value={file.progress} min={0} max={100} id={`element_${file.id}`} className="track-progress"/>
        </td>
      </tr>
    );
  }
}

class TrackEdit extends React.Component {
  onOpen () {
    let { track } = this.props;
    if(track) {
      const metadata = JSON.parse(track.metadata).length ? JSON.parse(track.metadata)[0]: {};
      const title = track.title ? track.title : '';
      const artist = track.subtitle ? track.subtitle : '';
      $("#trackTitle").val(title);
      $("#trackArtist").val(artist);
    }
  }

  submit(e) {
    e.preventDefault();

    const { track, dispatch, closer } = this.props;
    let trackTitle = ReactDOM.findDOMNode(this.trackTitle).value;
    let trackArtist = ReactDOM.findDOMNode(this.trackArtist).value;

    track.title = trackTitle;
    track.subtitle = trackArtist;

    dispatch(actions.editTrack(track));

    closer();
  }

  render() {
    const { modal, closer } = this.props;

    return (
      <Modal show={modal} onHide={closer} onEntering={::this.onOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Track Title & Artist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={::this.submit}>
            <FormGroup className="text-center" controlId="trackTitle">
              <FormControl type='text' id="trackTitle" ref={(trackTitle) => this.trackTitle = trackTitle} autoFocus placeholder="Title"/>
            </FormGroup>
            <FormGroup className="text-center" controlId="trackArtist">
              <FormControl type='text' id="trackArtist" ref={(trackArtist) => this.trackArtist = trackArtist} placeholder="Artist"/>
            </FormGroup>
            <hr className="transparent" />
            <FormGroup>
              <Button lg type='submit' bsStyle='primary' disabled={status == 'saving'} className="btn-block">Save</Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

class ProjectAudio extends React.Component {
  constructor(...args) {
    super(...args);

    const projectId = this.props.params.projectId ? this.props.params.projectId : null;
    this.state = {
      projectId: projectId, tracks: [], editModal: false, editTrack: null,
      drag: false, playingTrack: {}, playingStatus: null, allChecked: false, checkedIds: []
    };
  }

  componentWillMount() {
    const { dispatch, project, status, tracks } = this.props;

    if(this.state.projectId && !project ) {
      dispatch(actions.getProject(this.state.projectId));
    }

    if(this.state.projectId && !status )
      dispatch(actions.getTracks(this.state.projectId));
    else
      this.checkTracksOrder(tracks);
  }

  componentDidMount() {
    const filepicker = require('filepicker-js');
    filepicker.setKey(FILEPICKER_KEY);
  }

  componentWillReceiveProps (nextProps) {
    const { playingTrack } = this.props;
    const { status, fileId, removedTrackIds } = nextProps;

    if(status == 'added' && fileId) {
      this.removeUploading(fileId);
    }

    if(status == 'deleted') {
      if(removedTrackIds.indexOf(playingTrack && playingTrack.id) !== -1) {
        this.setState({ playingTrack: null});
      }
    }

    if(status == 'got' || status == 'saved' || status == 'added' || status == 'deleted') {
      this.checkTracksOrder(nextProps.tracks);
    }
  }

  setPlaying(track, playing) {
    if(playing)
      this.setState({ playingTrack: track});
    else
      this.setState({ playingTrack: null});
  }

  uploadFile(e) {
    e.preventDefault();
    $(".alert", "#alert-box").remove();

    let thisInstance = this;

    var pickerDlg = filepicker.pickMultiple(
      {
        extensions: ['.mp3', '.aif', '.aiff', '.wav', '.aac', '.ogg', '.mp2', '.wma', '.flac', '.amr', '.m4a'],
        container: 'modal',
        backgroundUpload: false,
        hide: true,
        openTo: 'COMPUTER',
        maxSize: 15 * 1024 * 1024,
      },
      function (files) {
        console.log('FPFiles', files);
      },
      function (FPError) {
        console.log('FPError', FPError);
        $(".alert.alert-danger", "#alert-box").html("Sorry, something went wrong. Please try again in a little bit.");
        $(".alert.alert-danger", "#alert-box").remove();
      },
      function (data) {
        thisInstance.onProgress(data, pickerDlg);
      }
    );
  }

  onProgress (file, dialog) {
    const { projectId } = this.state;
    const { uploadings, dispatch } = this.props;

    if(file.progress == 100) {
      dispatch(actions.createTrack(projectId, file));
    }

    const index = getArrayIndex(file.id, uploadings);

    if(index == -1) {
      uploadings.push({ id: file.id, progress: file.progress, dialog: dialog });
    }
    else {
      uploadings[index].progress = file.progress;
    }

    dispatch(actions.setUploadings(uploadings));
  }

  removeUploading (id) {
    const { uploadings, dispatch } = this.props;
    const index = getArrayIndex(id, uploadings);

    if(index !== -1) {
      uploadings.splice(index, 1);
    }

    dispatch(actions.setUploadings(uploadings));
  }

  cancelUploading (file) {
    if(file.dialog) {
      file.dialog.close();
    }

    this.removeUploading(file.id);
  }

  editTrack (track) {
    this.setState({ editModal: true, editTrack: track });
  }

  closeEditTrackModal() {
    this.setState({ editModal: false, editTrack: null });
  }

  enableDrag() {
    this.setState({ drag: true });
  }

  disableDrag() {
    this.setState({ drag: false });
  }

  checkTracksOrder(tracks) {
    const { projectId } = this.state;
    const orderString = cookie.load('project_' + projectId + '_tracks_order');
    let orderTracks = [];

    console.log("the value of orderString is " + orderString);

    if(orderString) {
      const order = orderString.toString().split(',');

      for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < tracks.length; j++) {
          if (order[i] == tracks[j].id)
            orderTracks.push(tracks[j]);
        }
      }
      if (orderTracks.length < tracks.length) {
        for (let i = orderTracks.length; i < tracks.length; i++) {
          orderTracks.push(tracks[i]);
        }
      }
    }
    else {
      orderTracks = tracks;
    }

    this.setState({tracks: orderTracks});
  }

  moveTrack(dragIndex, hoverIndex) {
    const { tracks } = this.state;
    const dragTrack = tracks[dragIndex];

    this.setState(update(this.state, {
      tracks: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragTrack]
        ]
      }
    }));
  }

  endDrop() {
    const { tracks } = this.state;
    const order = [];
    for(let i=0; i<tracks.length; i++) {
      order.push(tracks[i].id);
    }

    this.setState({ drag: false });
    cookie.save('project_' + this.state.projectId + '_tracks_order', order.join(','), { path: '/' });
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
        dispatch(actions.deleteTracks(project.id, checkedIds));
      }
    }
  }

  render() {
    const { dispatch, statusText, status, uploadings, router, loading } = this.props;
    const { projectId, editModal, editTrack, drag, tracks, playingTrack, allChecked } = this.state;

    let alert = null;
    let isLoading = false;

    if(status == 'saved') {
      // alert = <Alert success>{ statusText }</Alert>;
    }
    else if(status == 'failed') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(status == 'saving') {
      alert = <Alert info>Saving a track, please wait...</Alert>;
    }
    else if(status == 'deleting') {
      alert = <Alert info>Deleting track(s), please wait...</Alert>;
    }
    else if (status == 'getting') {
      isLoading = true;
    }
    else if (status == 'got') {

    }

    return (
      <div id='body' className="project-body">
        <ProjectHeader router={router} />

        <div className="body-sidebar__container">
          <div className="container__with-scroll">
            <div id="alert-box-project">
              <ProjectAlert />
            </div>

            <Row>
              <Col sm={8} >
                <h3 className="mt0">Audio Manager</h3>
              </Col>
              <Col sm={4} className="mt2 text-right">
                <span className="mr2">Actions: </span>
                <select className="status-filter" ref="actions">
                  <option key={0} value=""> ---- ---- ---- </option>
                  <option key={1} value="Delete">Delete</option>
                </select>
                <Button className="btn-white" onClick={::this.goAction}>Go</Button>
              </Col>
            </Row>
            <hr className="mt0 separator" />

            <div id="alert-box">
              { alert }
            </div>

            <table className="table track-listing">
              <thead>
              {((thisInstance) => {
                  if(!isLoading) {
                    if(tracks.length || uploadings.length) {
                      return <tr>
                        <td className="text-center"><input type="checkbox" onClick={::this.checkAll} checked={allChecked}/></td>
                        <td className="text-center">&nbsp;</td>
                        <td className="text-center">#</td>
                        <td>Title</td>
                        <td>Artist</td>
                        <td className="text-center">Time</td>
                        <td className="text-center">&nbsp;</td>
                      </tr>;
                    } else {
                      return <tr><td colSpan={7} className="text-danger text-center">No tracks were found.</td></tr>;
                    }
                  } else {
                    return <tr><td colSpan={7} className="text-center"><div className="loading"></div></td></tr>;
                  }
                })(this)
              }
              </thead>
              <tbody>
                {((thisInstance) => {
                  if(!isLoading) {
                    if(tracks.length || uploadings.length) {
                      return tracks.map((track, i) => {
                        let playing = playingTrack && playingTrack.id == track.id ? true: false;

                        return <AudioTrack key={track.id} index={i} id={track.id} track={track} projectId={projectId} drag={drag}
                           dispatch={dispatch} editor={() => thisInstance.editTrack(track)}
                           moveTrack={::thisInstance.moveTrack} endDrop={::thisInstance.endDrop}
                           enableDrag={::thisInstance.enableDrag} disableDrag={::thisInstance.disableDrag}
                           sendPlaying={::thisInstance.setPlaying} playing={playing}
                           allChecked={allChecked} checkItem={(checked, id) => thisInstance.checkItem(checked, id)}
                        />;
                      });
                    }
                  }
                })(this)}

                {((thisInstance) => {
                  return uploadings.map((file, i) =>
                    <RowUploading key={i} rowIndex={tracks.length + i} file={file} closer={() => thisInstance.cancelUploading(file)} />
                  );
                })(this)}
              </tbody>
            </table>

            <TrackEdit modal={ editModal } track={ editTrack } dispatch={dispatch} closer={::this.closeEditTrackModal} />

            <p className="mini-text"><strong>IMPORTANT:</strong> By uploading anything to ArtTracks, you hereby certify that you own the copyrights in or have all the necessary rights related to such content to upload it.</p>
          </div>

          <div className="body-sidebar__element">
            <p className="text-center mt4"><span className="huge rubix-icon icon-outlined-cloud-upload"></span></p>
            <h4 className="text-center color-primary"><a href="javascript:void(0)" onClick={::this.uploadFile}>Add Tracks</a></h4>
            <p className="text-center">Drag and drop audio tracks anywhere in this area to add them to your project.</p>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  project: state.project.project,
  status: state.tracks.status,
  statusText: state.tracks.statusText,
  tracks: state.tracks.tracks,
  uploadings: state.tracks.uploadings,
  fileId: state.tracks.fileId,
  removedTrackIds: state.tracks.removedTrackIds,
  loading: state.loading
});

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(ProjectAudio));
