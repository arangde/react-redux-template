import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import ReactTimeout from 'react-timeout';
import actions from '../../redux/actions';
import { FILEPICKER_KEY } from '../../constants';

import {
    Row,
    Col,
    Grid,
    Form,
    FormGroup,
    FormControl,
    Button
} from '@sketchpixy/rubix';

class Profile extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = { avatar: null, status: null, fullName: '', username: '', language: '' };
  }

  componentWillMount() {
    let { dispatch } = this.props;

    dispatch(actions.getProfile());
    // dispatch(actions.getSettings('email'));
  }

  componentDidMount() {
    const filepicker = require('filepicker-js');
    filepicker.setKey(FILEPICKER_KEY);
  }

  componentWillReceiveProps(newProps) {
    const { fullName, language, mugshot, status, cmdType } = newProps;
    const username = cookie.load('username');

    this.setState({ status: status });

    this.props.setTimeout(() => {
      if(status == 'saved' && cmdType == 'profile') {
        this.setState({ status: null });
      }
    }, 3000);

    this.setState({ avatar: mugshot, fullName: fullName, username: username, language: language });
  }

  getProfileJson() {
    const { fullName, username, language } = this.state;
    return { full_name: fullName, username, language };
  }

  saveProfile(e) {
    e.preventDefault();

    const { dispatch, mugshot } = this.props;

    let profile = this.getProfileJson();
    profile.mugshot = mugshot ? mugshot: '';

    dispatch(actions.saveSettings('profile', profile));
  }

  saveEmail(e) {
    e.preventDefault();

    let { dispatch } = this.props;
    let newEmail = ReactDOM.findDOMNode(this.newEmail).value;

    dispatch(actions.saveSettings('email', {email: newEmail}));
  }

  changeAvatar(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    const { fullName, username, language } = this.state;

    filepicker.pick({
      extensions: ['.png', '.jpg', '.jpeg'],
      container: 'modal',
      openTo: 'COMPUTER',
      maxSize: 15 * 1024 * 1024,
      cropRatio: 1,
      conversions: ['crop']
    }, function (FPFile) {
      console.log('FPFile', FPFile);
      let profile = { full_name: fullName, username, language, mugshot: FPFile.url };

      dispatch(actions.saveSettings('profile', profile));
      dispatch(actions.setAvatar(profile.mugshot));
    }, function (FPError) {
      console.log('FPError', FPError);
    });
  }

  removeAvatar(e) {
    e.preventDefault();

    if(!confirm("Are you sure to remove the avatar?"))
      return false;

    const { dispatch } = this.props;
    let profile = this.getProfileJson();
    profile.mugshot = "";

    dispatch(actions.saveSettings('profile', profile));
    dispatch(actions.setAvatar(profile.mugshot));
  }

  handleFullName(e) {
    this.setState({fullName: e.target.value});
  }

  handleUsername(e) {
    this.setState({username: e.target.value});
  }

  handleLanguage(e) {
    this.setState({language: e.target.value});
  }

  render() {
    const { statusText, cmdType } = this.props;
    const { status, fullName, username, language } = this.state;
    const email = cookie.load('email');

    let alertProfile = null;
    let alertEmail = null;
    if(status == 'failed' && cmdType == 'profile') {
      alertProfile = <FormGroup className='has-error'>
        <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span></FormGroup>;
    }
    else if(status == 'failed' && cmdType == 'email') {
      alertEmail = <FormGroup className='has-error'>
        <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span></FormGroup>;
    }
    else if(status == 'saved' && cmdType == 'profile') {
      alertProfile = <FormGroup className='has-success'>
        <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span></FormGroup>;
    }
    else if(status == 'saved' && cmdType == 'email') {
      alertEmail = <FormGroup className='has-warning'>
        <span className="help-block" dangerouslySetInnerHTML={{__html: statusText}}></span></FormGroup>;
    }

    const avatar = this.state.avatar ?
        <img src={ this.state.avatar } width='115' height='115' alt='sarah_patchett' /> :
        <img src='/imgs/avatars/no-avatar.png' width='115' height='115' alt='sarah_patchett' />;

    return (
      <div className="body-container">
        <div className="container__with-scroll">
          <Grid>
            <Row>
              <Col md={6} lg={4}>
                <h3 className="header">Personal Information</h3>

                <Row>
                  <Col sm={5}>
                    <span className='avatar-container'>{ avatar }</span>
                  </Col>
                  <Col sm={7}>
                    <a href="javascript:;" onClick={::this.changeAvatar}>{ this.state.avatar ? 'Change Pic': 'Upload Pic'}</a><br />
                    { this.state.avatar ? <a href="javascript:;" onClick={::this.removeAvatar}>Remove Pic</a>: null }
                  </Col>
                </Row>

                <hr className="transparent" />

                <Form onSubmit={::this.saveProfile}>
                  <FormGroup>
                    <label>Your Name</label>
                    <FormControl type="text" placeholder="Your Name" ref="fullName" value={fullName} onChange={::this.handleFullName} />
                  </FormGroup>
                  <FormGroup>
                    <label>Your Username</label>
                    <FormControl type="text" placeholder="Your Username" ref="username" value={username} onChange={::this.handleUsername} />
                  </FormGroup>
                  <FormGroup>
                    <label>Language Setting</label>
                    <select className="form-control" ref="language" value={language} onChange={::this.handleLanguage}>
                      <option value="en">English</option>
                      <option value="ru">Russian</option>
                      <option value="pt">Spanish</option>
                    </select>
                  </FormGroup>
                  <hr className="transparent" />
                  <hr className="transparent" />
                  <Row>
                    <Col md={6}>
                      <Button lg type='submit' bsStyle='primary' disabled={status == 'saving'} className="btn-sq btn-block">Save</Button>
                    </Col>
                  </Row>
                  <hr className="transparent" />
                  { alertProfile }
                </Form>
              </Col>
              <Col md={6} lg={4} lgOffset={1}>
                <h3 className="header">Email Information</h3>

                <p>Your current email address is:<br /><span className="dark">{email}</span></p>
                <hr className="transparent" />
                <p>To change the email address linked to your account, please enter your new email address below. This is also your username.</p>

                <Form onSubmit={::this.saveEmail}>
                  <FormGroup>
                    <label>Updated Email Address</label>
                    <FormControl type="text" placeholder="New Email Address" ref={(newEmail) => this.newEmail = newEmail} />
                  </FormGroup>
                  <hr className="transparent" />
                  <hr className="transparent" />
                  <Row>
                    <Col md={6}>
                      <Button lg type='submit' bsStyle='primary' disabled={status == 'saving'} className="btn-sq btn-block">Save</Button>
                    </Col>
                  </Row>
                  <hr className="transparent" />
                  { alertEmail }
                </Form>

              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.profile
});

export default connect(mapStateToProps)(ReactTimeout(Profile));
