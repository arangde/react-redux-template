import React from 'react';
import { connect } from 'react-redux';
import ReactTimeout from 'react-timeout';

import {
  Alert,
} from '@sketchpixy/rubix';

class ProjectAlert extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { status: null };
  }

  componentWillReceiveProps (nextProps) {
    const { status } = nextProps;

    this.setState({ status: status });

    this.props.setTimeout(() => {
      if(status == 'saved') {
        this.setState({ status: null });
      }
    }, 3000);
  }

  render() {
    const { statusText } = this.props;
    const { status } = this.state;

    var alert = null;
    if(status == 'saved') {
      alert = <Alert success>{ statusText }</Alert>;
    }
    else if(status == 'failed' || status == 'failedArtwork') {
      alert = <Alert danger>{ statusText }</Alert>;
    }
    else if(status == 'getting') {
      alert = <Alert info>Loading, please wait...</Alert>;
    }
    else if(status == 'saving') {
      alert = <Alert info>Saving, please wait...</Alert>;
    }
    else if(status == 'deleting') {
      alert = <Alert info>Deleting, please wait...</Alert>;
    }

    return (
      alert
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.project.status,
  statusText: state.project.statusText,
});

export default connect(mapStateToProps)(ReactTimeout(ProjectAlert));
