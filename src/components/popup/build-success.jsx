import React from 'react';
import { connect } from 'react-redux';

import {
  Modal,
  Button,
} from '@sketchpixy/rubix';

class BuildSuccess extends React.Component {

  goToBuilds() {
    const { project, router } = this.props;
    router.push("/project/" + project.id + "/builds");
  }

  render() {
    return (
      <div className="modal-wrapper">
        <div className="modal-content hollow">
          <Modal.Header className="text-center">
            <img src="/imgs/icons/icon_success_2.svg" title="Success" alt="Success" className="icon-success" />
            <h1>Success! Your order is in.</h1>
            <h4>This process can take up to an hour, depending on how many folks are ahead of you. Once ready, your videos will be available immediately for download, playback and distribution.</h4>
            <Button lg bsStyle='primary' className="btn-sq big-ok" onClick={::this.goToBuilds}>OK</Button>
          </Modal.Header>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  statusText: state.build.statusText,
  status: state.build.status,
  project: state.project.project,
});

export default connect(mapStateToProps)(BuildSuccess);
