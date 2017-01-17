import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FILEPICKER_KEY } from '../../constants';
import actions from '../../redux/actions';

import {
    Modal,
    Row,
    Col,
    Button,
    Alert,
} from '@sketchpixy/rubix';

const ratios = {
  horizontal: 16/9,
  square: 1,
  vertical: 9/16
};

class ArtworkUpload extends React.Component {

  componentDidMount() {
    const filepicker = require('filepicker-js');
    filepicker.setKey(FILEPICKER_KEY);
  }

  componentWillReceiveProps (nextProps) {
    const { router } = this.props;
    const { project, status } = nextProps;

    if (status == "saved") {
      router.push(`/project/${project.id}`);
    }
  }

  uploadFile(e) {
    e.preventDefault();
    $(".alert", "#alert-box").remove();

    const { project, setting, dispatch, router } = this.props;
    const ratio = ratios[setting.shape];

    filepicker.pick({
      extensions: ['.png', '.jpg', '.jpeg', '.gif'],
      container: 'modal',
      openTo: 'COMPUTER',
      maxSize: 15 * 1024 * 1024,
      cropRatio: ratio,
      conversions: ['crop']
    }, function (FPFile) {
      console.log('FPFile', FPFile);
      dispatch(actions.saveArtwork(project.id, setting, FPFile));
      router.push('/popup/loading');
    }, function (FPError) {
      console.log('FPError', FPError);
      $("#alert-box").append("<div class='alert alert-danger'>Sorry, something went wrong. Please try again in a little bit.</div>");
    });
  }

  skipUpload(e) {
    e.preventDefault();
    $(".alert", "#alert-box").addClass("hide");

    const { project, setting, dispatch } = this.props;

    dispatch(actions.saveArtwork(project.id, setting, null));
  }

  render() {
    const { statusText, status, project } = this.props;

    var alert = null
    if(status == 'saved') {
      alert = <Alert success>{ statusText }</Alert>;
    }
    else if(status == 'failed') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(status == 'saving') {
      alert = <Alert info>Saving, please wait...</Alert>;
    }

    return (
      <div className="modal-wrapper">
        <div className="closer"><Link to={`/project/${project.id}`}><span className="rubix-icon icon-fontello-cancel-5"></span></Link></div>
        <div className="modal-content hollow">
          <Modal.Header className="text-center">
            <h1>Upload an image</h1>
            <h4>This is required to generate final artwork from your chosen layout.</h4>
          </Modal.Header>
          <Modal.Body className="text-center">

            <div className="file-dropper">
              <span>Drop file here or</span>
              <Button lg bsStyle='primary' className="btn-sq" disabled={status == 'saving'} onClick={::this.uploadFile}>Choose a File</Button>
            </div>

            <div id="alert-box" className="text-left">
              { alert }
            </div>

          </Modal.Body>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusText: state.artwork.statusText,
  status: state.artwork.status,
  setting: state.artwork.setting,
  project: state.project.project,
});

export default connect(mapStateToProps)(ArtworkUpload);
