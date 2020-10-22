import React, { Component, Fragment } from 'react';
// import AuthLayout from '@/components/AuthLayout';
// import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import LoginModal from '@/components/LoginModal';

@connect(auth => ({
  auth: auth.auth,
}))
class PrivateRoute extends Component {
  render() {
    const { children, auth } = this.props;

    if (auth.auth.username === 'admin') {
      return <Fragment>{children}</Fragment>;
    }
    return <LoginModal />;
  }
}
export default PrivateRoute;
