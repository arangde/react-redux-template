import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { parseNotificationMessageHtml } from '../../services/utils';
import actions from '../../redux/actions';
import Pusher from 'react-pusher';

import {
    Row,
    Col,
    Grid,
    Alert
} from '@sketchpixy/rubix';

class Notification extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = parseNotificationMessageHtml(this.props.notification.html);
    }

    viewNotification() {
        const { dispatch, notification } = this.props;

        if(notification.viewed) {
            return false;
        }
        else {
            dispatch(actions.updateNotification('profile', notification, {viewed: true}));
        }
    }

    removeNotification() {
        const { dispatch, notification } = this.props;

        dispatch(actions.removeNotification('profile', notification.id));
    }

    detailObject() {
        const { dispatch, router } = this.props;
        const { obj, id } = this.state;

        if(obj == "project") {
            dispatch(actions.resetProject());

            router.push(`/${obj}/${id}`);
        }
    }

    render() {
        const { notification } = this.props;
        const viewedClassName = notification.viewed ? null: "unread";
        const viewed = notification.viewed ?
            <span className="rubix-icon icon-fontello-circle-empty"></span> :
            <span className="rubix-icon icon-fontello-circle"></span>;
        let message = <p>{notification.message}</p>;
        if(this.state.html) {
            message = <p>{this.state.before}<a href="javascript:;" onClick={::this.detailObject}>{this.state.text}</a>{this.state.after}</p>;
        }
        return (
            <li className={ viewedClassName }>
                <Row>
                    <Col sm={1} className="text-center">
                        <a href="javascript:;" className="btn-close" onClick={::this.removeNotification}><span>×</span></a>
                    </Col>
                    <Col sm={8}>{ message }</Col>
                    <Col sm={3} className="text-right pr5">
                        <span>{ moment(notification.modified_date).startOf('minute').fromNow() }</span>
                        <a href="javascript:;" className="view-mark" onClick={::this.viewNotification}>{ viewed }</a>
                    </Col>
                </Row>
            </li>
        );
    }
}

class Notifications extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = { filter: "all", notifications: [] };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(actions.getNotifications('profile'));
    }

    componentWillReceiveProps(nextProps) {
        const {status, notifications} = nextProps;

        if(status == 'got') {
            this.setState({notifications: notifications});
        }
    }

    onPusher(notification) {
        console.log(notification);
        this.setState({notifications: this.state.notifications.concat(notification)});
    }

    dismissAlert(e) {
        $(e.target).parents(".alert-box").remove();
    }

    filter(filter) {
        this.setState({filter: filter});
    }

    markReadAll() {
        const { dispatch, notifications } = this.state;

        notifications.forEach(notification => {
            if (!notification.viewed) {
                dispatch(actions.updateNotification('profile', notification, {viewed: true}));
            }
        });
    }

    render() {
        const { notifications, filter } = this.state;
        let unreadCount = 0;

        notifications.forEach(notification => {
            if(!notification.viewed)
                unreadCount++;
        });

        let alert = <div className="alert-box"><Alert bsStyle="danger" onDismiss={::this.dismissAlert}>
            Service Availability Warning: Scheduled Site Maintenance: ArtTracks will be down for a regularly scheduled maintenance on September 10,
            begining at 02:00 EST for about 60 minutes. This will not affect any video builds.
        </Alert></div>;

        return (
            <div className="body-container">
                <div className="container__with-scroll">
                    <Grid>
                        <Row>
                            <Col md={12} lg={10} lgOffset={1}>
                                <Row>
                                    <Col md={2}><h3>Notifications</h3></Col>
                                    { unreadCount > 0 ?
                                        <Col md={4} className="pt6">
                                            <span className="rubix-icon icon-fontello-circle"></span>&nbsp;&nbsp;&nbsp;
                                            {unreadCount} unread notifications
                                        </Col> :
                                        <Col md={4} className="pt6"></Col>
                                    }
                                    <Col md={6} className="text-right notification-filters pt6">
                                        Show:
                                        <a href="javascript:;" className="view-filter" onClick={()=>this.filter('all')}>{ filter == "all"? <b>All</b>: "All"}</a>
                                        <a href="javascript:;" className="view-filter" onClick={()=>this.filter('read')}>{ filter == "read"? <b>Read</b>: "Read"}</a>
                                        <a href="javascript:;" className="view-filter" onClick={()=>this.filter('unread')}>{ filter == "unread"? <b>Unread</b>: "Unread"}</a>
                                        &nbsp;&nbsp;|&nbsp;&nbsp;
                                        <a href="javascript:;" className="view-filter primary" onClick={::this.markReadAll}>Mark all as read</a>
                                    </Col>
                                </Row>
                                <ul className="notifications">
                                    { notifications.map(notification => {
                                        if(filter == "all" || (filter == 'read' && notification.viewed) || (filter == 'unread' && !notification.viewed))
                                            return <Notification key={notification.id} notification={notification} {...this.props} />;
                                        else
                                            return null;
                                    }) }
                                </ul>
                                <Pusher channel="profile-notifications" event="add" onUpdate={::this.onPusher} />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.notifications.status,
    statusText: state.notifications.statusText,
    notifications: state.notifications.profileNotifications,
    removedId: state.notifications.removedId,
});

export default connect(mapStateToProps)(Notifications);