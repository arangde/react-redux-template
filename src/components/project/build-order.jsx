import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import actions from '../../redux/actions';
import { getSecondsFromDuration } from '../../services/utils';

import {
  Row,
  Col,
  Alert,
  Button,
} from '@sketchpixy/rubix';

class BuildTrack extends React.Component {
  render() {
    const { track, artwork, credit, remover } = this.props;
    const thumbnail = artwork && artwork.thumbnail? <img src={artwork.thumbnail} /> : <img src="/imgs/blank.gif" />;
    const metadata = JSON.parse(track.metadata).length ? JSON.parse(track.metadata)[0]: {};
    const duration = metadata.duration? metadata.duration: '00:00';
    const credits = credit * getSecondsFromDuration(duration);

    return (
      <li>
        <Row>
          <Col md={5}>
            <div className="preview">
              {thumbnail}
              <span className="duration">{ duration }</span>
            </div>
          </Col>
          <Col md={7}>
            <span className="track-title">{ track.title ? track.title : '---- ----' }</span>
            <span className="artist">{ track.subtitle? track.subtitle : '----' }</span>
            <span className="color-primary">Credits: { credits }</span>
          </Col>
        </Row>
        <a href="javascript:;" className="closer" onClick={ remover }><span className="rubix-icon icon-fontello-cancel-5"></span></a>
      </li>
    );
  }
}

class ProjectBuildOrder extends React.Component {
  constructor(...args) {
    super(...args);

    const { user_credits_purchased, user_credits_expiring } = this.props;

    const projectId = this.props.params.projectId ? this.props.params.projectId : null;

    this.state = { projectId: projectId, tracks: [], credit: 1, availableCredts: user_credits_purchased + user_credits_expiring };
  }

  componentWillMount() {
    const { dispatch, project, tracks } = this.props;

    if(this.state.projectId && (!project || this.state.projectId != project.id)) {
      dispatch(actions.getProject(this.state.projectId));
    }

    if(tracks.length > 0) {
      this.checkTracksOrder(tracks);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { project, status, buildOrder } = nextProps;
    if (project) {
      this.setState({ projectId: project.id });
    }

    if(nextProps.tracks.length) {
      this.checkTracksOrder(nextProps.tracks);
    }

    if(this.props.status == 'buildOrdering' && status == 'buildOrdered') {
      this.buildProcess(buildOrder);
    }
  }

  checkTracksOrder(tracks) {
    const { projectId } = this.state;
    const orderString = cookie.load('project_' + projectId + '_tracks_order');
    let orderTracks = [];

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

  cancelAndExit() {
    const { router } = this.props;
    router.push('/project/' + this.state.projectId);
  }

  buildOrder() {
    const { dispatch, project } = this.props;

    dispatch(actions.createBuildOrder(project));
  }

  buildProcess(buildOrder) {
    const { dispatch, router, project, artworks } = this.props;
    const { tracks, credit } = this.state;
    const totalCredits = this.calcTotalCredits();
    let size = '';
    if(credit == 0) {
      size = '640x360';
    }
    else if(credit == 1) {
      size = '854x480';
    }
    else if(credit == 2) {
      size = '1280x720';
    }

    dispatch(actions.addBuildingTracks(project, artworks[0], tracks));
    tracks.forEach(function(track) {
      dispatch(actions.buildTrack(project, artworks[0], track, size, totalCredits, buildOrder));
    });

    router.push('/popup/loading');
  }

  setCredit(credit, e) {
    this.setState({credit: credit});
    $('.white-box.active').removeClass('active');
    $('#white-box' + credit).addClass('active');
  }

  removeTrack(index) {
    const { tracks } = this.state;

    tracks.splice(index, 1);
    this.setState({tracks: tracks});
  }

  calcTotalCredits() {
    const { tracks, credit } = this.state;
    let totalCredits = 0;

    tracks.forEach((track) => {
      let metadata = JSON.parse(track.metadata).length ? JSON.parse(track.metadata)[0]: {};
      let duration = metadata.duration? metadata.duration: '00:00';
      totalCredits += credit * getSecondsFromDuration(duration);
    });

    return totalCredits;
  }

  render() {
    const { status, statusText, project, artworks } = this.props;
    const { tracks, credit, availableCredts } = this.state;
    const totalCredits = this.calcTotalCredits();

    let alert = null;
    if(status == 'failed') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(availableCredts < totalCredits) {
      alert = <Alert danger>Your available credits are lesser than required.</Alert>;
    }

    const disabled = availableCredts < totalCredits || tracks.length == 0 ? true: false;

    return (
      <div id='body' className="project-body build-order-page">
        <div id="body-header">
          <div className="pull-right">
            <Button lg onClick={::this.cancelAndExit} className="btn-hollow btn-sq">Cancel & Exit</Button>
          </div>
          <h2>{ project.title }</h2>
        </div>

        <div className="body-sidebar__container wide-sidebar">
          <div className="container__with-scroll">
            <Row>
              <Col sm={6}>
                <h3 className="mt0">
                  <span className="ml2">Select Video Size</span>
                </h3>
              </Col>
              <Col sm={6} className="mt2 text-right">
                <span className="mr2">Your available credits: { availableCredts }</span>
                <a href="javascript:;">Add credits</a>
              </Col>
            </Row>
            <hr className="mt0" />
            <div id="alert-box">{ alert }</div>
            <div className="video-size-cards">
              <Row>
                <Col sm={4}>
                  <div className="white-box" id="white-box0" onClick={(e) => this.setCredit(0, e)}>
                    <span className="dp">360p</span>
                    <span className="color-primary">Small</span>
                    <p className="credits">
                      <b>(free)</b>
                    </p>
                    <p><b>Best for:</b><br />Viewing on smartphones <br />and smaller mobile <br />devices</p>
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="white-box active" id="white-box1" onClick={(e) => this.setCredit(1, e)}>
                    <span className="dp">480p</span>
                    <span className="color-primary">Medium</span>
                    <p className="credits">
                      <b>1 credit</b><br />per second
                    </p>
                    <p><b>Best for:</b><br />Viewing on tablets, <br />embedded video players <br />on websites</p>
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="white-box" id="white-box2" onClick={(e) => this.setCredit(2, e)}>
                    <span className="dp">720p</span>
                    <span className="color-primary">Large(HD)</span>
                    <p className="credits">
                      <b>2 credits</b><br />per second
                    </p>
                    <p><b>Best for:</b><br />Desktop and/or laptop <br />computer full-screen <br />viewing</p>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col sm={12}>
                <Button lg bsStyle='primary' className="btn-text-large btn-block"
                  disabled={ disabled } onClick={::this.buildOrder}>Place Your Order</Button>
              </Col>
            </Row>
          </div>

          <div className="body-sidebar__element">
            <Row className="mt3 pr5-imp pl5-imp">
              <Col sm={6}>
                <h4 className="mt2">
                  <span className="">Videos ({tracks.length})</span>
                </h4>
              </Col>
              <Col sm={6} className="mt2 text-right">
                <Link to={"/project/" + project.id + "/audio"}>Add Tracks</Link>
              </Col>
            </Row>
            <hr className="mt0 mb0 mr3 ml5" />

            <ul className="tracks">
              {((thisInstance) => {
                return tracks.map((track, i) => {
                  return <BuildTrack key={track.id} track={track} artwork={artworks[0]} credit={credit} remover={() => thisInstance.removeTrack(i)} />
                });
              })(this)}
            </ul>

            <Row className="pr5-imp pl5-imp">
              <Col sm={6}>
                <h4 className="mt0">
                  <span className="">Total Credits:</span>
                </h4>
              </Col>
              <Col sm={6} className="text-right">
                <span className="color-primary">{ totalCredits }</span>
              </Col>
            </Row>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.build.status,
  statusText: state.build.statusText,
  project: state.project.project,
  tracks: state.tracks.tracks,
  artworks: state.artwork.artworks,
  user_credits_purchased: state.profile.credits_purchased,
  user_credits_expiring: state.profile.credits_expiring,
  buildOrder: state.build.buildOrder,
});

export default connect(mapStateToProps)(ProjectBuildOrder);
