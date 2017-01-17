/**
 * Created by jarosanger on 8/20/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import cookie from 'react-cookie';
import actions from '../../redux/actions';

export function checkAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        constructor(props) {
            super(props);
            this.loggedIn = true;
        }

        componentWillMount () {
            this.checkAuth(this.props.isAuthenticated);
        }

        componentWillReceiveProps (nextProps) {
            this.checkAuth(nextProps.isAuthenticated);
        }

        checkAuth (isAuthenticated) {
            if (!isAuthenticated) {
                const token = cookie.load('token');
                if(!token) {
                    this.loggedIn = false;

                    let redirectAfterLogin = this.props.location.pathname;
                    let { router } = this.props;

                    router.push(`/login?next=${redirectAfterLogin}`);
                }
                else {
                    let { dispatch } = this.props;
                    dispatch(actions.getSettings('profile'));
                    dispatch(actions.setLoggedIn());
                }
            }
        }

        render () {
            return (
                this.loggedIn === true
                    ? <Component {...this.props}/>
                    : null
            )
        }
    }

    const mapStateToProps = (state) => ({
        isAuthenticated: state.auth.isAuthenticated
    });

    return connect(mapStateToProps)(AuthenticatedComponent);
}
