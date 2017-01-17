import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { Link, withRouter } from 'react-router';
import IconSVG from './icons.jsx';

import HeaderNotifications from './header-notifications.jsx';
import actions from '../../redux/actions';

import {
    SidebarBtn,
    Navbar,
    DropdownButton,
    MenuItem,
    Grid,
    Row,
    Col
} from '@sketchpixy/rubix';

@withRouter
class HeaderNavigation extends React.Component {

    logout () {
        const { router } = this.props;

        let { dispatch } = this.props;
        dispatch(actions.logout());
        router.push('/login');
    }

    goProfile (href) {
        const { router } = this.props;
        router.push(href);
    }

    render() {
        const { mugshot } = this.props;

        const fullName = cookie.load('fullName')? cookie.load('fullName'): "";
        const username = cookie.load('username')? cookie.load('username'): "";

        const avatar = mugshot ? <img src={ mugshot } width='50' height='50' alt='sarah_patchett' /> :
            <img src='/imgs/avatars/no-avatar.png' width='50' height='50' alt='sarah_patchett' />;

        return (
            <ul className="pull-right nav navbar-nav">
                <li role="presentation" className="">
                    <a role="button" href="javascript:;">
                        <IconSVG icon="life_buoy" /><span className="global-nav-item">Help</span>
                    </a>
                </li>
                <li role="presentation" className="notification-badge">
                    <HeaderNotifications />
                </li>
                <li role="presentation" className="">
                    <a role="button" href="javascript:;">
                        <span className="avatar-container">{ avatar }</span>
                    </a>
                </li>
                <li role="presentation" className="nav-profile">
                    <DropdownButton bsStyle="link" pullRight={true} title={username} id="profile-dropdown">
                        <MenuItem eventKey="4.1" onClick={this.goProfile.bind(this, '/settings')}>Profile</MenuItem>
                        <MenuItem eventKey="4.2" onClick={this.goProfile.bind(this, '/settings/change-password')}>Change Password</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4.4" onClick={::this.logout}>Logout</MenuItem>
                    </DropdownButton>
                </li>
            </ul>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
          <Grid id='navbar'>
            <Row>
              <Col xs={12}>
                <Navbar fixedTop fluid id="rubix-nav-header">
                  <Row>
                    <Col xs={2} sm={5}>
                      <SidebarBtn visible={"xs", "sm", "md", "lg"} />
                    </Col>
                    <Col xs={10} sm={2} className="text-center">
                      <Link to="/" className="brand-icon"><img src='/imgs/logo.png' alt='ArtTracks' /></Link>
                    </Col>
                    <Col sm={5} xsHidden>
                      <HeaderNavigation {...this.props} />
                    </Col>
                  </Row>
                </Navbar>
              </Col>
            </Row>
          </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    mugshot: state.profile.mugshot,
});

export default connect(mapStateToProps)(Header);
