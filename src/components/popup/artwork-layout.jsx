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

class ArtworkLayout extends React.Component {

  componentWillMount() {
    // const { dispatch, templates } = this.props;
    //
    // if(templates.length == 0) {
    //   dispatch(actions.getArtworkTemplates());
    // }
  }

  componentWillReceiveProps (nextProps) {
    const { router } = this.props;
    const { setting } = nextProps;
    if (setting && setting.template) {
      router.push(`/popup/upload`);
    }
  }

  setLayout(template) {
    let { dispatch } = this.props;
    dispatch(actions.setArtLayout(template));
  }

  render() {
    const { project, templates, setting } = this.props;

    return (
      <div className="modal-wrapper">
        <div className="closer"><Link to={`/project/${project.id}`}><span className="rubix-icon icon-fontello-cancel-5"></span></Link></div>
        <div className="modal-content wider hollow">
          <Modal.Header className="text-center">
            <h1>Select an artwork layout</h1>
            <h4>Pick a design from below</h4>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Row>
              {((thisInstance) => {
                if(templates.length) {
                  return templates.map((template, i) => {
                    if(template.classification == setting.shape) {
                      return <Col key={i} md={4} className="template-layout template-layout__{setting.shape}">
                        <p className={`layout-thumbnail layout-thumbnail__${setting.shape}`}><img src={template.thumbnail}/></p>
                        <h4>{template.name}</h4>
                        <Button lg bsStyle='primary' className="btn-sq" onClick={() => thisInstance.setLayout(template.id)}>Select Template</Button>
                        <p className="layout-description"><strong>Description:</strong><br/>{template.description}</p>
                      </Col>;
                    }
                    else {
                      return null;
                    }
                  });
                }
                else {
                  return <Col md={12} className="text-left">No templates found in the shape '{setting.shape}'.</Col>;
                }
              })(this)}
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

export default connect(mapStateToProps)(ArtworkLayout);
