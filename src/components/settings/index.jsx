import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

@connect((state) => state)
export default class Settings extends React.Component {
    render() {
        const routes = [
            { label: 'PROFILE', link: '/settings' },
            { label: 'CHANGE PASSWORD', link: '/settings/change-password' },
            { label: 'CONNECTED ACCOUNTS', link: '/settings/connected-accounts' },
            { label: 'NOTIFICATIONS', link: '/settings/notifications' }
        ];
        const { pathname } = this.props.location;

        return (
          <div id='body' className="profile-body">
            <div id="body-header" className="extended-header">
              <h2>Account Settings</h2>
              <ul className="body-header__navigation">
                  {routes.map((route) => {
                      return <li key={route.link}><Link to={route.link} className={route.link==pathname? 'active': ''}>{route.label}</Link></li>;
                  })}
              </ul>
            </div>
            {this.props.children}
          </div>
        );
    }
}
