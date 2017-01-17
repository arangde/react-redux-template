import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Toggle from 'react-toggle';
import Slider from 'rc-slider';
import { FILEPICKER_KEY } from '../../constants';
import actions from '../../redux/actions';
import { getObjectValue } from '../../services/utils';

import {
  Row,
  Col,
  Alert,
  Form,
  FormGroup,
  FormControl,
  Button,
  ControlLabel,
} from '@sketchpixy/rubix';

import ProjectHeader from './project-header.jsx';
import ProjectAlert from './project-alert.jsx';

class ProjectSettings extends React.Component {
  constructor(...args) {
    super(...args);

    const projectId = this.props.params.projectId ? this.props.params.projectId : null;
    this.state = { projectId: projectId, titleAnimation: false, textColor: "#000", backColor: "#fff",
      defaultBranding: false, customBranding: false, opacity: 100 };
  }

  componentWillMount() {
    const { dispatch, project, status } = this.props;

    if(this.state.projectId && (!project || this.state.projectId != project.id)) {
      dispatch(actions.getProject(this.state.projectId));
    }

    if(this.state.projectId && !status) {
      dispatch(actions.getArtworks(this.state.projectId));
    }

    if(project) {
      this.loadSettings(project);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { project, status } = nextProps;

    if (project && (!status || status == "got" || status == "saved")) {
      this.loadSettings(project);
    }
  }

  componentDidMount() {
    const { textColor, backColor } = this.state;
    const thisInstance = this;
    const filepicker = require('filepicker-js');
    filepicker.setKey(FILEPICKER_KEY);

    $("#text-colorpicker").spectrum({
      color: textColor,
      chooseText: "Choose",
      cancelText: "Cancel",
      hideAfterPaletteSelect: true,
      change: function(color) {
        thisInstance.setState({ textColor: color.toRgbString()});
      },
      showInput: true,
      showInitial: true,
      showAlpha: true,
      showPalette: true,
      showSelectionPalette: true,
      preferredFormat: "rgb"
    });

    $("#background-colorpicker").spectrum({
      color: backColor,
      chooseText: "Choose",
      cancelText: "Cancel",
      hideAfterPaletteSelect: true,
      change: function(color) {
        thisInstance.setState({ backColor: color.toRgbString()});
      },
      showInput: true,
      showInitial: true,
      showAlpha: true,
      showPalette: true,
      showSelectionPalette: true,
      preferredFormat: "rgb"
    });
  }

  loadSettings(project) {
    const settings = JSON.parse(project.settings);

    this.setState({ projectId: project.id });

    if (settings && settings.length) {
      let textColor = getObjectValue(settings[0], ["title_bar", "text_color"], "#000");
      let backColor = getObjectValue(settings[0], ["title_bar", "background_color"], "#fff");
      this.setState({
        titleAnimation: getObjectValue(settings[0], ["title_bar", "display"], true),
        textColor: textColor,
        backColor: backColor,
        defaultBranding: getObjectValue(settings[0], ["watermark", "attribution"], true),
        customBranding: getObjectValue(settings[0], ["watermark", "custom"], false),
        opacity: getObjectValue(settings[0], ["watermark", "opacity"], 50),
      });

      $("#text-colorpicker").spectrum("set", textColor);
      $("#background-colorpicker").spectrum("set", backColor);
    }
  }

  uploadWatermark(e) {
    e.preventDefault();
    $(".alert", "#alert-box").remove();
    const { project, dispatch } = this.props;

    filepicker.pick({
      extensions: ['.png', '.jpg', '.jpeg'],
      container: 'modal',
      openTo: 'COMPUTER',
      maxSize: 15 * 1024 * 1024,
    }, function (FPFile) {
      console.log('FPFile', FPFile);
      dispatch(actions.saveProjectWatermark(project.id, FPFile.url));
    }, function (FPError) {
      console.log('FPError', FPError);
      $("#alert-box").append("<div class='alert alert-danger'>Sorry, something went wrong. Please try again in a little bit.</div>");
    });
  }

  deleteWatermark(e) {
    e.preventDefault();
    const { project, dispatch } = this.props;

    if(confirm("Are you sure to delete this watermark?")) {
      dispatch(actions.saveProjectWatermark(project.id, ""));
    }
  }

  toggleTitleAnimation(e) {
    const titleAnimation = e.target.checked;
    this.setState({titleAnimation: titleAnimation});
  }

  toggleDefaultBranding(e) {
    const defaultBranding = e.target.checked;
    this.setState({defaultBranding: defaultBranding});

    if(defaultBranding) {
      this.setState({customBranding: false});
    }
  }

  toggleCustomBranding(e) {
    const customBranding = e.target.checked;
    this.setState({customBranding: customBranding});

    if(customBranding) {
      this.setState({defaultBranding: false});
    }
  }

  handleOpacity(opacity) {
    this.setState({opacity: opacity});
  }

  saveSettings() {
    const { dispatch, project } = this.props;
    const { projectId, titleAnimation, textColor, backColor, defaultBranding, customBranding, opacity } = this.state;
    let settings = [
      {
        "title_bar": {
          "display": titleAnimation,
          "text_color": textColor,
          "background_color": backColor
        },
        "watermark": {
          "attribution": defaultBranding,
          "custom": customBranding,
          "opacity": opacity
        }
      }
    ];
    let watermark = project && project.watermark? project.watermark: "";

    dispatch(actions.saveProjectSettings(projectId, watermark, JSON.stringify(settings)));
  }

  resetSettings() {
    this.setState({
      titleAnimation: false,
      textColor: "#000",
      backColor: "#fff",
      defaultBranding: false,
      customBranding: false,
      opacity: 100,
    });
    $("#text-colorpicker").spectrum("set", "#000");
    $("#background-colorpicker").spectrum("set", "#fff");
  }

  percentFormatter(v) {
    return `${v} %`;
  }

  render() {
    const { status, statusText, project, artworks, router } = this.props;
    const { titleAnimation, textColor, backColor, defaultBranding, customBranding, opacity } = this.state;

    let alert = null;
    if(status == 'failed') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(status == 'saving') {
      alert = <Alert info>Saving, please wait...</Alert>;
    }

    let thumbnail = null;
    if(project && artworks && artworks.length > 0) {
      thumbnail = <img src={ artworks[0].thumbnail } />;
    }
    else {
      thumbnail = <img src="/imgs/no-artwork.png" />;
    }

    let playTitle = null;
    if(project && titleAnimation) {
      playTitle = <div className="play-title" style={{color: textColor, backgroundColor: backColor}}>
        <span className="title">Track Title</span>
        <span className="subtitle">Artist Name</span>
      </div>;
    }

    let watermarkSrc = null;
    if(project && project.watermark) {
      watermarkSrc = <img src={project.watermark} />;
    }

    let watermarkAction = null;
    if(project && project.watermark) {
      watermarkAction = <Col sm={7} className="pt6 pl0"><a href="javascript:;" onClick={::this.deleteWatermark}>Delete watermark</a></Col>;
    }
    else {
      watermarkAction = <Col sm={7} className="pt2 pl0">Drag and drop your<br/>image into this box or <br/>
        <a href="javascript:;" onClick={::this.uploadWatermark}>Click to Upload</a></Col>;
    }

    let watermarkPreview = null;
    if(defaultBranding) {
      watermarkPreview = <img src="/imgs/arttracks-watermark.png" className="watermark" style={{opacity: parseInt(opacity)/100}}/>;
    }
    else if(watermarkSrc && customBranding) {
      watermarkPreview = <img src={project.watermark} className="watermark custom" style={{opacity: parseInt(opacity)/100}}/>;
    }

    return (
      <div id='body' className="project-body project-settings">
        <ProjectHeader router={router} />

        <div className="body-sidebar__container wide-sidebar">
          <div className="container__with-scroll">
            <div id="alert-box">
              <ProjectAlert />
            </div>

            <Row>
              <Col>
                <h3 className="header">Settings Preview</h3>
                {/*<div id="alert-box">*/}
                  {/*{ alert }*/}
                {/*</div>*/}
                <div className="artwork-preview">
                  { thumbnail }
                  { playTitle }
                  { watermarkPreview }
                </div>
              </Col>
            </Row>
          </div>

          <div className="body-sidebar__element">
            <div className="scroll-container">
              <div className="pr5-imp pl5-imp scroll-box">
                <h4 className="header">Basic Options</h4>
                <Form horizontal className="form-settings">
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Play title animation</Col>
                    <Col sm={4} className="text-right">
                      <Toggle checked={titleAnimation} onChange={::this.toggleTitleAnimation} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Text color</Col>
                    <Col sm={4} className="text-right">
                      <FormControl id='text-colorpicker' />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Background color</Col>
                    <Col sm={4} className="text-right">
                      <FormControl id='background-colorpicker' />
                    </Col>
                  </FormGroup>
                </Form>
                <h4 className="header">Branding Options</h4>
                <Form horizontal className="form-settings">
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Show ArtTracks watermark</Col>
                    <Col sm={4} className="text-right">
                      <Toggle checked={defaultBranding} onChange={::this.toggleDefaultBranding} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Use custom watermark</Col>
                    <Col sm={4} className="text-right">
                      <Toggle checked={customBranding} onChange={::this.toggleCustomBranding} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={5}>
                      <div className="watermark-preview">{watermarkSrc}</div>
                    </Col>
                    { watermarkAction }
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={12}>Set transparency</Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={12}>
                      <Slider value={opacity} min={40} onChange={::this.handleOpacity}
                        tipFormatter={::this.percentFormatter} tipTransitionName="rc-slider-tooltip-zoom-down"/>
                    </Col>
                  </FormGroup>
                </Form>
              </div>

              <div className="scroll-container__actions">
                <div className="pr2-imp pl2-imp">
                  <Row>
                    <Col sm={9}>
                      <Button lg onClick={::this.saveSettings} className="btn-primary btn-block">Save</Button>
                    </Col>
                    <Col sm={3} className="text-right pt2" style={{    "textAlign": "center", "paddingTop": "13px"}}>
                      <a href="javascript:;" onClick={::this.resetSettings} className="text-primary">Reset</a>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.project.status,
  statusText: state.project.statusText,
  project: state.project.project,
  artworks: state.artwork.artworks
});

export default connect(mapStateToProps)(ProjectSettings);
