import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { VIDEO_PAGE_LIMIT } from '../../constants';
import actions from '../../redux/actions';

import {
  Row,
  Col,
  Alert,
  Pagination,
  Button,
} from '@sketchpixy/rubix';

class VideoProject extends React.Component {

  detailProject() {
    const { video, dispatch, router } = this.props;
    dispatch(actions.setProject(video));
    router.push(`/project/${video.id}`);
  }

  removeProject() {
    if(confirm("Are you sure to delete this video project?")) {
      const { video, dispatch} = this.props;
      dispatch(actions.deleteProject(video.id));
    }
  }

  mouseOver(e) {
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).find(".overlay").fadeIn(300);
  }

  mouseOut(e) {
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).find(".overlay").hide();
  }

  render() {
    const { video } = this.props;
    const tracks = video.track_count? video.track_count: 0;
    const thumb_url = video.thumbnail ? video.thumbnail : "/imgs/no-artwork.png";

    return (
      <li onMouseEnter={::this.mouseOver} onMouseLeave={::this.mouseOut}>
        <img src="/imgs/blank.gif" className="background" />
        <div className="track-image">
          <img src={thumb_url} />
        </div>
        <div className="track-details">
          <span className="track-details__title">{video.title}</span>
          <span className="track-details__tracks">{tracks} Tracks</span>
        </div>
        <div className="overlay">
          <a href="javascript:;" onClick={::this.removeProject}><span className="rubix-icon icon-dripicons-trash"></span></a>
          <Button className="btn-open btn-primary btn-hollow btn-block" onClick={::this.detailProject}>View Project</Button>
        </div>
      </li>
    );
  }
}

class Videos extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { activePage: 1, pageLimit: VIDEO_PAGE_LIMIT, pages: 1, pageVideos: [], all: 0 };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(actions.getVideos());
  }

  componentWillReceiveProps(newProps) {
    const { videos } = newProps;
    this.handlePage(videos, this.state.activePage);
  }

  handleSelect(eventKey) {
    const { videos } = this.props;

    this.setState({ activePage: eventKey });
    this.handlePage(videos, eventKey);
  }

  handlePage(videos, activePage) {
    var pageVideos = [];

    for(var i=0; i<this.state.pageLimit; i++) {
      var index = (activePage - 1) * this.state.pageLimit + i;
      if(videos.length > index)
        pageVideos.push(videos[index]);
    }
    this.setState({ pages: Math.ceil(videos.length/this.state.pageLimit), pageVideos: pageVideos, all: videos.length });
  }

  newProject() {
    const { router, dispatch } = this.props;

    dispatch(actions.resetProject());
    router.push("/popup/title");
  }

  render() {
    const { statusProject, dispatch, router } = this.props;
    const { activePage, pages, pageVideos } = this.state;

    let alert = null;
    if(statusProject == 'deleting') {
      alert = <Alert info>Deleting, please wait...</Alert>;
    }

    return (
      <div id='body'>
        <div id="body-header">
          <h2 className="pull-left">Video Projects</h2>
          <Button lg onClick={::this.newProject} className="pull-right btn-blue btn-sq">New Project</Button>
        </div>
        <div className="body-sidebar__container">
          <div className="container__with-scroll">
            <Row>
              <Col sm={12}>
                {/*<ul className="filters-list pull-right">*/}
                  {/*<li><span className="rubix-icon icon-fontello-th-large"></span></li>*/}
                  {/*<li className="active"><span className="rubix-icon icon-fontello-th"></span></li>*/}
                  {/*<li><span className="rubix-icon icon-fontello-th-list"></span></li>*/}
                {/*</ul>*/}
                <h3 className="canvas-header">All</h3>
              </Col>

              <Col sm={12}>
                <div id="alert-box">
                  { alert }
                </div>
              </Col>

              <Col sm={12}>
                <ul className="videos-list thumb">
                  <li className="plus"><Link to="javascript:void(0)" onClick={::this.newProject}><span className="rubix-icon icon-ikons-plus"></span></Link></li>
                  { pageVideos.map(video => <VideoProject key={ video.id } video={ video } {...this.props} />) }
                </ul>
                {( (pages > 1) ?
                  <nav aria-label="Page navigation">
                    <Pagination
                      prev
                      next
                      ellipsis
                      boundaryLinks
                      bsSize="medium"
                      items={pages}
                      maxButtons={5}
                      activePage={activePage}
                      onSelect={::this.handleSelect} />
                  </nav>
                  : null
                )}
              </Col>
            </Row>
          </div>

          <div className="body-sidebar__element">
            <h4 className="header">Welcome!</h4>
            <p>This is where all the magic happens. Here are some things that you might want to get started on immediately:</p>

            <ul className="helpers-list">
              <li><Link to="#">Start a new project</Link></li>
              <li><Link to="#">Connect to YouTube</Link></li>
              <li><Link to="#">Upload an avatar</Link></li>
            </ul>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.videos.status,
  statusText: state.videos.statusText,
  videos: state.videos.videos,
  statusProject: state.project.status,
});

export default connect(mapStateToProps)(Videos);
