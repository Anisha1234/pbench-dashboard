import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({
  selectedPrivateController: global.selectedPrivateController,
}))
class RunResults extends Component {
  render() {
    const { selectedPrivateController } = this.props;
    return (
      <React.Fragment>
        <p>
          Run Result for the controller
          <h1>
            <b>{selectedPrivateController}</b>
          </h1>
        </p>
      </React.Fragment>
    );
  }
}

export default RunResults;
