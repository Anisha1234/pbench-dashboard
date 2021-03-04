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
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import styles from './index.less';

@connect(({ global, dashboard }) => ({
  selectedResults: global.selectedResults,
  privateResults: dashboard.privateResults,
}))
class RunResults extends Component {
  render() {
    const { selectedResults, privateResults } = this.props;
    const selectedResultData = privateResults.filter(score => score.result[0] === selectedResults);
    const acceptanceStatus = selectedResultData[0].saved;
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
            <Text component={TextVariants.h1}> {selectedResults}</Text>
          </TextContent>
          {acceptanceStatus === true ? '' : unAcceptedHint}
          <TextContent>
            <Text component={TextVariants.h3}>
              {' '}
              Detail Page about specific run that you drilled into
            </Text>
          </TextContent>
        </div>
      </React.Fragment>
    );
  }
}

export default RunResults;
