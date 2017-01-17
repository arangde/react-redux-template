import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';

import {
  Sidebar, SidebarNav, SidebarNavItem, Grid, Row, Col,
} from '@sketchpixy/rubix';

import { Link, withRouter } from 'react-router';

@withRouter
class ApplicationSidebar extends React.Component {
  render() {
    const { mugshot, fullName } = this.props;
    const avatar = mugshot ? mugshot: '/imgs/avatars/no-avatar.png';

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-nav-profile text-center'>
                <span className='avatar-container'><img src={ avatar } width='115' height='115' alt='sarah_patchett' /></span>
                <h4>{fullName}</h4>
                <h6>BASIC PLAN</h6>
                {/*<a href="#" className="btn btn-primary btn-hollow">Upgrade</a>*/}
              </div>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}}>
                  <SidebarNavItem glyph='icon-stroke-gap-icons-TV' name='Video Projects' href='/videos' />
                  <SidebarNavItem eventKey={4} glyph='icon-ikons-equalizer' name='Account Settings' href='/settings' />
                  <SidebarNavItem glyph='icon-simple-line-icons-question' name='FAQ' href='#' />
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

@withRouter
class SidebarContainer extends React.Component {
  render() {
    return (
      <div id='sidebar'>
        <div id='sidebar-container'>
          <Sidebar sidebar={0}>
            <ApplicationSidebar {...this.props} />
          </Sidebar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fullName: state.profile.fullName,
  mugshot: state.profile.mugshot,
});

export default connect(mapStateToProps)(SidebarContainer);
