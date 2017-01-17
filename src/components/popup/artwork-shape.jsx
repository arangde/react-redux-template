import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import actions from '../../redux/actions';

import {
    Modal,
    Row,
    Col,
    Button
} from '@sketchpixy/rubix';

class ArtworkShape extends React.Component {

  componentWillMount() {
    const { dispatch, templates } = this.props;

    if(templates.length == 0) {
      dispatch(actions.getArtworkTemplates());
    }

    dispatch(actions.resetArtworkSetting());
  }

  componentWillReceiveProps (nextProps) {
    const { router } = this.props;
    const { setting } = nextProps;

    if (setting && setting.shape) {
      router.push(`/popup/layout`);
    }
  }

  setShape(shape) {
    const { dispatch, templates } = this.props;
    dispatch(actions.setArtShape(shape));
  }

  render() {
    const { project } = this.props;

    return (
      <div className="modal-wrapper">
        <div className="closer"><Link to={`/project/${project.id}`}><span className="rubix-icon icon-fontello-cancel-5"></span></Link></div>
        <div className="modal-content wide hollow">
          <Modal.Header className="text-center">
            <h1>Pick a canvas shape</h1>
            <h4>All videos you build using this artwork will take on its shape.</h4>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Row>
              <Col md={4} className="">
                <Button lg bsStyle='primary' className="btn-sq btn-shape btn-shape__horizontal" onClick={() => this.setShape('horizontal')}>Horizontal</Button>
              </Col>
              <Col md={4} className="">
                <Button lg bsStyle='primary' className="btn-sq btn-shape btn-shape__vertical" onClick={() => this.setShape('vertical')}>Vertical</Button>
              </Col>
              <Col md={4} className="">
                <Button lg bsStyle='primary' className="btn-sq btn-shape btn-shape__square" onClick={() => this.setShape('square')}>Square</Button>
              </Col>
            </Row>
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
  templates: state.artwork.templates,
  project: state.project.project,
});

export default connect(mapStateToProps)(ArtworkShape);
