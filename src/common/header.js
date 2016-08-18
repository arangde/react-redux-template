import React from 'react';
import classNames from 'classnames';

import { SidebarBtn, Navbar, Nav, NavItem, Icon, Grid, Row, Col } from '@sketchpixy/rubix';

class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <a href='#'>
            <img src='/imgs/common/logo.png' alt='rubix' width='111' height='28' />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

class HeaderNavigation extends React.Component {
  render() {
    var props = {
      ...this.props,
      className: classNames('pull-right', this.props.className)
    };

    return (
      <Nav {...props}>
        <NavItem className='logout' href='#'>
          <Icon bundle='fontello' glyph='off-1' />
        </NavItem>
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    return (
      <Grid id='navbar' {...this.props}>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <HeaderNavigation />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
