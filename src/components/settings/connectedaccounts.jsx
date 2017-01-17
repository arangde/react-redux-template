import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Toggle from 'react-toggle';
import actions from '../../redux/actions';
import { getProviderIdByName, getProviderById } from '../../services/utils';

import {
    Alert,
    Row,
    Col,
    Grid,
    Form,
    FormGroup,
    FormControl,
    Button
} from '@sketchpixy/rubix';

class Provider extends React.Component {
    connect() {
        const { provider } = this.props;
        location.href = `/connect/${provider.name.toLowerCase()}`;
    }

    render() {
        const { provider } = this.props;
        const logo = provider.logo? <img src={provider.logo} />: null;

        return (
            <li className="col-md-4">
                <div className="provider">
                    <div className="provider-logo">
                        { logo }
                    </div>
                    <p className="description">
                        { provider.description }
                    </p>
                    <Button lg bsStyle="primary" className="btn-block btn-hollow" onClick={::this.connect}>Add</Button>
                </div>
            </li>
        );
    }
}

class ConnectedAccount extends React.Component {
    constructor(...args) {
        super(...args);
    }

    componentWillReceiveProps (nextProps) {
        const { connectedAccount } = nextProps;
    }

    changeActive(e) {
        const active = e.target.checked;
        const { dispatch, connectedAccount } = this.props;

        dispatch(actions.updateConnectedAccount(connectedAccount, {active: active}));
    }

    remove() {
        if(confirm("Are you sure to remove this account?")) {
            const { dispatch, connectedAccount } = this.props;
            dispatch(actions.deleteConnectedAccount(connectedAccount));
        }
    }

    render() {
        const { connectedAccount, providers } = this.props;
        const provider = getProviderById(connectedAccount.provider, providers);
        const logoImg = provider && provider.icon ? provider.icon: '/imgs/blank.gif';
        const extraData = JSON.parse(connectedAccount.extra_data);
        const displayName = extraData.displayName? extraData.displayName: '';
        const username = extraData.username? '@' + extraData.username: '';
        const profilePhoto = extraData.photo? extraData.photo: '/imgs/avatars/no-avatar.png';
        return (
            <li className="mb3">
                <Row>
                    <Col md={3} className="pl0">
                        <div className="avatar">
                            <img src={ profilePhoto } />
                            <div className="provider-icon">
                                <img src={logoImg} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6} className="pt2 pl0">
                        <p>{ displayName }</p>
                        <p className="small">{ username }{ connectedAccount.id }</p>
                    </Col>
                    <Col md={3} className="pt2 pl2 pr0">
                        <Toggle checked={ connectedAccount.active } onChange={::this.changeActive} />
                        <a href="javascript:;" className="closer" onClick={::this.remove}><span className="rubix-icon icon-fontello-cancel-5"></span></a>
                    </Col>
                </Row>
            </li>
        );
    }
}

class ConnectedAccounts extends React.Component {
    constructor(...args) {
        super(...args);
        const providerName = this.props.params.providerName ? this.props.params.providerName : null;
        const returnStatus = this.props.params.returnStatus ? this.props.params.returnStatus : null;
        this.state = {
            providerName: providerName,
            returnStatus: returnStatus,
            checked: false,
            filters: [],
            filter: "All"
        };
    }

    componentWillMount() {
        const { dispatch, providers, connectedUser, status, connects } = this.props;

        if(!providers.length) {
            dispatch(actions.getProviders());
        }
        if(!connects.length) {
            dispatch(actions.getConnects());
        }
    }

    componentWillReceiveProps (nextProps) {
        const { providerName, returnStatus, checked } = this.state;
        const { dispatch, providers, connectedUser, status, connects } = nextProps;

        if(status == 'gotConnects') {
            if (providerName && returnStatus != 'failed' && !checked) {
                if (connectedUser && providerName == connectedUser.provider && providers.length) {
                    const providerId = getProviderIdByName(providerName, providers);
                    if (providerId > 0) {
                        this.setState({checked: true});
                        dispatch(actions.addConnect(providerId, connectedUser, connects));
                    }
                }
            }
        }

        const filters = [];
        connects.forEach(connect => {
            let provider = getProviderById(connect.provider, providers);
            if(provider && filters.indexOf(provider.name) === -1)
                filters.push(provider.name);
        });

        this.setState({filters: filters});
    }

    changeFilter(e) {
        this.setState({filter: e.target.value});
    }

    render() {
        const { providers, connects, status, statusText } = this.props;
        const { connectProvider, returnStatus, filter, filters } = this.state;

        let alert = null;
        if(status == 'added') {
            // alert = <Alert success>{ statusText }</Alert>;
        }
        else if(status == 'failed') {
            alert = <Alert danger>{ statusText }</Alert>;
        }
        else if(connectProvider && returnStatus == 'failed') {
            alert = <Alert danger>It has been failed to connect {connectProvider}.</Alert>;
        }
        else if(status == 'saving') {
            alert = <Alert info>Saving, please wait...</Alert>;
        }
        else if(status == 'deleting') {
            alert = <Alert info>Deleting, please wait...</Alert>;
        }
        else if(status == 'adding') {
            alert = <Alert info>Adding, please wait...</Alert>;
        }

        return (
            <div className="body-sidebar__container wide-sidebar">
                <div className="container__with-scroll">
                    <h3 className="header">Connected Accounts</h3>
                    <hr className="transparent" />

                    <div id="alert-box">{ alert }</div>

                    <p>Leverage ArtTracks' built-in power of distribution and share to many different places by connecting your accounts from the services below.
                        &nbsp;<a href="javascript:;">Upgrade to Pro</a> to connect up to 12 newtworks at once!</p>

                    <ul className="providers-list row">
                        { providers.map(provider => <Provider key={ provider.id } provider={ provider } {...this.props} />) }
                    </ul>
                </div>
                <div className="body-sidebar__element pl3-imp pr3-imp">
                    <Row className="mt3">
                        <Col sm={8} className="pl0 pr0">
                            <h4 className="mt2">
                                Your Connections
                            </h4>
                        </Col>
                        <Col sm={4} className="pl0 pr0 mt2 text-right">
                            <select className="provider-filter" onChange={::this.changeFilter}>
                                <option value="All">All</option>
                                { filters.map((filter, i) => <option key={i} value={filter}>{filter}</option>) }
                            </select>
                        </Col>
                    </Row>
                    <hr className="mt0 mb3" />
                    <ul className="connected-accounts">
                        { connects.map(connect => {
                            let provider = getProviderById(connect.provider, providers);
                            if((provider && provider.name == filter) || filter == "All")
                                return <ConnectedAccount key={connect.id} connectedAccount={connect} {...this.props} />;
                            else
                                return null;
                        }) }
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.provider.status,
    statusText: state.provider.statusText,
    providers: state.provider.providers,
    connects: state.provider.connects,
    connectedUser: state.provider.connectedUser
});

export default connect(mapStateToProps)(ConnectedAccounts);