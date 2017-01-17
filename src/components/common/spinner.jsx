import React from 'react';

class Spinner extends React.Component {
  render() {
    var { loadingText } = this.props;
    return (
      <div>
        <span>{loadingText}</span>
      </div>
    );
  }
}
