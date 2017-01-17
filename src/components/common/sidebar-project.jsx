import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';

import {
  Sidebar, SidebarNav, SidebarNavItem, Grid, Row, Col,
} from '@sketchpixy/rubix';

import { Link, withRouter } from 'react-router';

class ApplicationSidebar extends React.Component {

  render() {
    const{ project, pathname } = this.props;
    const urlPrefix = project? '/project/' + project.id: '/project';

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-nav-profile pl3'>
                <h3 className="white"><Link to="/videos">&larr; Exit</Link></h3>
              </div>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}}>
                  <SidebarNavItem eventKey={1} glyph='icon-simple-line-icons-globe-alt' name='Overview' href={urlPrefix} />
                  <SidebarNavItem eventKey={2} glyph='icon-simple-line-icons-volume-2' name='Audio Tracks' href={`${urlPrefix}/audio`} />
                  <SidebarNavItem eventKey={3} glyph='icon-ikons-equalizer' name='Settings' href={`${urlPrefix}/settings`} />
                  <SidebarNavItem eventKey={4} glyph='icon-outlined-setting-1' name='Video Builds' href={`${urlPrefix}/builds`} />
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class SidebarProject extends React.Component {
  render() {
    return (
      <div id='sidebar'>
        <div id='sidebar-container'>
          <Sidebar sidebar={0}>
            <ApplicationSidebar {...this.props}/>
          </Sidebar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  project: state.project.project,
});

export default connect(mapStateToProps)(SidebarProject);
