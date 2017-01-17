import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';

import { MainContainer } from '@sketchpixy/rubix';

/* Common Components */
import { checkAuthentication } from './components/auth/checkauth.jsx';
import Sidebar from './components/common/sidebar.jsx';
import SidebarProject from './components/common/sidebar-project.jsx';
import Header from './components/common/header.jsx';
import Footer from './components/common/footer.jsx';

/* Without Sidebar */
import Login from './components/auth/login.jsx';
import Signup from './components/auth/signup.jsx';
import ForgotPassword from './components/auth/forgotpassword.jsx';
import ResetPassword from './components/auth/resetpassword.jsx';

/* With Sidebar */
import Dashboard from './components/dashboard.jsx';
import Settings from './components/settings/index.jsx';
import Profile from './components/settings/profile.jsx';
import ChangePassword from './components/settings/changepassword.jsx';
import ConnectedAccounts from './components/settings/connectedaccounts.jsx';
import Notifications from './components/settings/notifications.jsx';

/* Videos & Project */
import Videos from './components/project/videos.jsx';
import ProjectOverview from './components/project/overview.jsx';
import ProjectAudio from './components/project/audio.jsx';
import ProjectBuildOrder from './components/project/build-order.jsx';
import ProjectBuilds from './components/project/builds.jsx';
import ProjectSettings from './components/project/settings.jsx';

/* Popup window */
import ProjectTitle from './components/popup/project-title.jsx';
import ArtworkShape from './components/popup/artwork-shape.jsx';
import ArtworkLayout from './components/popup/artwork-layout.jsx';
import ArtworkUpload from './components/popup/artwork-upload.jsx';
import ProjectLoading from './components/popup/project-loading.jsx';
import BuildSuccess from './components/popup/build-success.jsx';

class App extends React.Component {
  render() {
    return (
      this.props.children
    );
  }
}

class Default extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        {this.props.children}
      </MainContainer>
    );
  }
}

class Main extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Header />
        <Sidebar open="true" />
        {this.props.children}
        <Footer />
      </MainContainer>
    );
  }
}

class ProjectContainer extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Header />
        <SidebarProject open="true" pathname={this.props.location.pathname} />
        {this.props.children}
        <Footer />
      </MainContainer>
    );
  }
}

class PopupContainer extends React.Component {
  render() {
    return (
        this.props.children
    );
  }
}

export default (
  <Route path="/" component={App}>

    <Route component={Default}>
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/reset-password/:uid/:token' component={ResetPassword} />

      <Route path='/popup' component={checkAuthentication(PopupContainer)}>
        <IndexRoute component={ProjectTitle} />
        <Route path='/popup/title' component={ProjectTitle} />
        <Route path='/popup/shape' component={ArtworkShape} />
        <Route path='/popup/layout' component={ArtworkLayout} />
        <Route path='/popup/upload' component={ArtworkUpload} />
        <Route path='/popup/loading' component={ProjectLoading} />
        <Route path='/popup/build-success' component={BuildSuccess} />
      </Route>

    </Route>

    <Route component={checkAuthentication(Main)}>
      <IndexRoute component={Videos} />

      <Route path='/settings' component={Settings}>
        <IndexRoute component={Profile} />
        <Route path='/settings/change-password' component={ChangePassword} />
        <Route path='/settings/connected-accounts/:providerName/:returnStatus' component={ConnectedAccounts} />
        <Route path='/settings/connected-accounts' component={ConnectedAccounts} />
        <Route path='/settings/notifications' component={Notifications} />
      </Route>

      <Route path='/videos' component={Videos} />
    </Route>

    <Route path='/project' component={checkAuthentication(ProjectContainer)}>
      <IndexRoute component={ProjectOverview} />
      <Route path='/project/:projectId' component={ProjectOverview} />
      <Route path='/project/:projectId/audio' component={ProjectAudio} />
      <Route path='/project/:projectId/build-order' component={ProjectBuildOrder} />
      <Route path='/project/:projectId/builds' component={ProjectBuilds} />
      <Route path='/project/:projectId/settings' component={ProjectSettings} />
    </Route>

  </Route>
);
