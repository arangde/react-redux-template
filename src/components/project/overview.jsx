import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import actions from '../../redux/actions';

import {
  Row,
  Col,
  Alert,
} from '@sketchpixy/rubix';

import ProjectHeader from './project-header.jsx';
import ProjectAlert from './project-alert.jsx';

class ProjectOverview extends React.Component {
  constructor(...args) {
    super(...args);

    const projectId = this.props.params.projectId ? this.props.params.projectId : null;
    this.state = { projectId: projectId };
  }

  componentWillMount() {
    const { dispatch, project, status } = this.props;

    if(this.state.projectId && (!project || this.state.projectId != project.id)) {
      dispatch(actions.getProject(this.state.projectId));
    }

    if(this.state.projectId && !status) {
      dispatch(actions.startLoading('OVERVIEW_ARTWORK_LOADER', 'Loading...'));
      dispatch(actions.getArtworks(this.state.projectId));
    }
  }

  componentWillReceiveProps (nextProps) {
    const { project, status, loading } = nextProps;
    if (project) {
      this.setState({ projectId: project.id });
      this.setState({ [loading.OVERVIEW_ARTWORK_LOADER]: { isLoading: false }});
    }
  }

  removeArtwork(artwork) {
    if(confirm("Are you sure you want to delete this Project Artwork?")) {
      const { dispatch } = this.props;
      dispatch(actions.removeArtwork(this.state.projectId, artwork.id));
    }
  }

  render() {
    const { loading, status, statusText, artworks, router } = this.props;
    let artworkTemplate = null;

    if(status == "getting" || status == "deleting") {
      artworkTemplate = <Row>
        <Col sm={12} className="text-center">
          <div className="loading"></div>
        </Col>
      </Row>;
    } else {
      if(artworks.length) {
        const artwork = artworks[0];
        artworkTemplate = <div className="artwork-preview">
          <img src={ artwork.thumbnail } />
          <div className="remover">
            <p className="h3">
              <a href="javascript:;" onClick={() => this.removeArtwork(artwork)}
                 className="btn btn-default btn-open btn-primary btn-hollow btn-block">Remove Artwork</a>
            </p>
          </div>
        </div>;
      }
      else {
        artworkTemplate = <div className="file-dropper tall">
          <span className="h3 mt0 mb0">
            <Link to="/popup/shape" className="btn-open btn-primary btn-hollow btn-block btn btn-default">Add Artwork</Link>
          </span>
        </div>;
      }
    }

    let alert = null;
    if(status == 'failed') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(status == 'saving') {
      alert = <Alert info>Saving, please wait...</Alert>;
    }
    else if(status == 'deleting') {
      alert = <Alert info>Deleting, please wait...</Alert>;
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
              <Col>
                <div id="alert-box">
                  { alert }
                </div>
                { artworkTemplate }
              </Col>
            </Row>
          </div>

          <div className="body-sidebar__element pr5-imp pl5-imp">
            <h4 className="header">Quick Access</h4>
            <p>Here are some things that you might want to do right away.</p>
            <ul className="helpers-list">
              <li><span className="color-primary">Upload audio</span></li>
              <li><span className="color-primary">Turn off watermark</span></li>
            </ul>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.artwork.status,
  statusText: state.artwork.statusText,
  project: state.project.project,
  artworks: state.artwork.artworks,
  loading: state.loading
});

export default connect(mapStateToProps)(ProjectOverview);
