import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(auth => ({
  auth: auth.auth,
}))
class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  componentDidMount() {
    this.handleModalToggle();
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  handleModalCancel = () => {
    const { dispatch } = this.props;
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
    dispatch(routerRedux.push(`/`));
  };

  handleLoginModal = () => {
    const { dispatch } = this.props;
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
    dispatch(routerRedux.push(`/auth`));
  };

  handleSignupModal = () => {
    const { dispatch } = this.props;
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
    dispatch(routerRedux.push(`/signup`));
  };

  render() {
    const { isModalOpen } = this.state;

    return (
      <React.Fragment>
        <Modal
          variant={ModalVariant.small}
          isOpen={isModalOpen}
          onClose={this.handleModalCancel}
          showClose="false"
          actions={[
            <Button key="confirm" variant="primary" onClick={this.handleLoginModal}>
              Login
            </Button>,
            <Button key="confirm" variant="link" onClick={this.handleSignupModal}>
              Signup
            </Button>,
            <Button key="cancel" variant="link" onClick={this.handleModalCancel}>
              Cancel
            </Button>,
          ]}
        >
          <TextContent>
            <Text component={TextVariants.h4}>
              This action requires login. Please login to Pbench Dashboard to continue.
            </Text>
          </TextContent>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LoginModal;
