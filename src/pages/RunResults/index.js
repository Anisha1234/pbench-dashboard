import React, { Component } from 'react';
import { connect } from 'dva';
import {
  TextContent,
  Text,
  TextVariants,
  Hint,
  HintBody,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { InfoCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import styles from './index.less';

@connect(({ privatedatastore }) => ({
  selectedPrivateController: privatedatastore.selectedPrivateController,
  privateControllers: privatedatastore.privateControllers,
}))
class RunResults extends Component {
  render() {
    const { selectedPrivateController, privateControllers } = this.props;
    const selectedPrivateControllerData = privateControllers.filter(
      score => score.result[0] === selectedPrivateController
    );
    const acceptanceStatus = selectedPrivateControllerData[0].seen;

    const acceptedHint = (
      <Hint className={styles.customAccepteddHint}>
        <HintBody>
          <Flex>
            <FlexItem>
              <InfoCircleIcon className={styles.info} />
            </FlexItem>
            <FlexItem>
              <TextContent>
                <Text component={TextVariants.h6}> You have already accepted this run </Text>
              </TextContent>
              <a style={{ color: 'red' }} className={styles.actionBtn}>
                Delete run
              </a>
            </FlexItem>
          </Flex>
        </HintBody>
      </Hint>
    );

    const unAcceptedHint = (
      <Hint className={styles.customUnAccepteddHint}>
        <HintBody>
          <Flex>
            <FlexItem>
              <ExclamationTriangleIcon className={styles.warning} />
            </FlexItem>
            <FlexItem>
              <TextContent>
                <Text component={TextVariants.h6}> You haven&apos;t managed the run yet </Text>
              </TextContent>
              <span>
                <a style={{ color: '#2c9af3' }} className={styles.actionBtn}>
                  Accept this run
                </a>
                <a style={{ color: 'red' }} className={styles.actionBtn}>
                  Delete run
                </a>
              </span>
            </FlexItem>
          </Flex>
        </HintBody>
      </Hint>
    );

    return (
      <React.Fragment>
        <div className={styles.paddingBig}>
          <TextContent className={styles.paddingSmall}>
            <Text component={TextVariants.h1}> {selectedPrivateController}</Text>
          </TextContent>
          {acceptanceStatus === true ? acceptedHint : unAcceptedHint}
        </div>
      </React.Fragment>
    );
  }
}

export default RunResults;
