import React from 'react';
import {
  Grid,
  GridItem,
  Card,
  TextContent,
  Text,
  TextVariants,
  Button,
  Tabs,
  Tab,
} from '@patternfly/react-core';
import {
  Chart,
  ChartBar,
  ChartAxis,
  ChartStack,
  ChartVoronoiContainer,
  ChartDonutThreshold,
  ChartDonutUtilization,
  ChartThemeColor,
} from '@patternfly/react-charts';
import { Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  OutlinedClockIcon,
  UndoAltIcon,
  ExternalLinkAltIcon,
  EllipsisVIcon,
} from '@patternfly/react-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { resultData, expirationLimit } from '../../../mock/overview';
import Table from '@/components/Table';
// import { Table } from 'antd';
import styles from './index.less';

@connect(({ datastore, global, user }) => ({
  user: user.user,
  indices: datastore.indices,
  selectedIndices: global.selectedIndices,
}))
class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0,
      barWidth: '20',
      totalResultData: resultData,
      newData: [],
      unlabledData: [],
    };
  }

  componentDidMount() {
    this.getSeperatedResults();
  }

  getSeperatedResults() {
    const { totalResultData } = this.state;
    const unlabledData = totalResultData.filter(x => x.seen === true);
    const newData = totalResultData.filter(x => x.seen !== true);
    this.setState({
      newData,
      unlabledData,
    });
  }

  onCollapse = (event, rowKey, isOpen) => {
    const { rows } = this.state;
    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows,
    });
  };

  onFavourite = e => {
    console.log(e);
  };

  showDrowpdown = id => {
    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  markSeen = row => {
    const { totalResultData } = this.state;
    const objIndex = totalResultData.findIndex(x => x.key === row.key);
    totalResultData[objIndex].seen = true;
    this.setState(
      {
        totalResultData,
      },
      () => {
        this.getSeperatedResults();
      }
    );
  };

  deleteResult = row => {
    const { totalResultData } = this.state;
    const updatedResult = totalResultData.filter(x => x.key !== row.key);
    this.setState(
      {
        totalResultData: updatedResult,
      },
      () => {
        this.getSeperatedResults();
      }
    );
  };

  handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  render() {
    const { activeTabKey, barWidth, newData, unlabledData } = this.state;

    const newDataColumns = [
      {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
        render: text => {
          return (
            <div>
              <Button variant="link" isInline style={{ marginBottom: '8px' }}>
                {text[0]}
              </Button>
              <br />
              <Text component={TextVariants.p} className={styles.subText}>
                <span className={styles.label}>{text[1]}</span>
              </Text>
            </div>
          );
        },
      },
      {
        title: 'End Time',
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: '',
        dataIndex: 'fav',
        key: 'fav',
        render: () => <Icon type="star" onClick={() => this.onFavourite()} />,
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (value, row) => {
          return (
            <div>
              <EllipsisVIcon
                onClick={() => this.showDrowpdown(`newrun${row.key}`)}
                className="dropbtn"
              />
              <div className={styles.dropdown} id={`newrun${row.key}`} style={{ display: 'none' }}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownLink} onClick={() => this.markSeen(row)}>
                    Mark as seen
                  </div>
                  <div className={styles.dropdownLink} onClick={() => this.deleteResult(row)}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          );
        },
      },
    ];

    const seenDataColumns = [
      {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
        render: text => (
          <div>
            <Button variant="link" isInline style={{ marginBottom: '8px' }}>
              {text[0]}
            </Button>
            <br />
            <Text component={TextVariants.p} className={styles.subText}>
              <span className={styles.label}>{text[1]}</span>
            </Text>
          </div>
        ),
      },
      {
        title: 'End Time',
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: 'Scheduled for deletion on',
        dataIndex: 'deletion',
        key: 'deletion',
        render: text => {
          const deleteDate = moment(new Date(Date.parse(text)));
          const currDate = moment(new Date());
          const remainingDays = currDate.diff(deleteDate, 'days');
          console.log(remainingDays, expirationLimit);
          if (remainingDays < 0) {
            return (
              <Text>
                {moment(text)
                  .add(7, 'days')
                  .format('YYYY-MM-DDTHH:mm:ss:SSSSSS')}
              </Text>
            );
          }
          return (
            <span>
              {moment(text)
                .add(7, 'days')
                .format('YYYY-MM-DDTHH:mm:ss:SSSSSS')}
              <FontAwesomeIcon
                style={{ paddingLeft: '5px', width: '20px' }}
                icon={faExclamationCircle}
                color="red"
                className={styles.icons}
              />
            </span>
          );
        },
      },
      {
        title: '',
        dataIndex: 'fav',
        key: 'fav',
        render: () => <Icon type="star" onClick={() => this.onFavourite()} />,
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (value, row) => {
          return (
            <div>
              <EllipsisVIcon
                onClick={() => this.showDrowpdown(`newrun${row.key}`)}
                className="dropbtn"
              />
              <div className={styles.dropdown} id={`newrun${row.key}`} style={{ display: 'none' }}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownLink} onClick={() => this.deleteResult(row)}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          );
        },
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div className={styles.paddingBig}>
        <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
          <Tab eventKey={0} title="Overview">
            <div style={{ marginTop: '32px' }}>
              <TextContent className={styles.paddingSmall}>
                <Text component={TextVariants.h1}> Overview</Text>
              </TextContent>
              <Grid hasGutter>
                <GridItem span={3}>
                  <Card>
                    <div className={styles.paddingBig}>
                      <TextContent>
                        <Text component={TextVariants.h3}>
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            color="red"
                            className={styles.icons}
                          />
                          Expiring Soon
                        </Text>
                        <Text component={TextVariants.p} className={styles.subText}>
                          These runs will be automatically deleted from the sysem if left
                          unacknowledged.
                          <Button variant="link" isInline>
                            Learn more
                          </Button>
                        </Text>
                      </TextContent>
                    </div>
                    <div className={styles.expiringValues}>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-1
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-2
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-3
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-4
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-5
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-6
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-7
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-8
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-9
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>

                      <Card className={styles.subCard}>
                        <div className={styles.paddingSmall}>
                          <TextContent>
                            <Button variant="link" isInline>
                              mock-result-10
                            </Button>
                            <Text component={TextVariants.p} className={styles.subText}>
                              <OutlinedClockIcon className={styles.icons} /> 2020-09-10T
                              11:52:34:552478
                            </Text>
                          </TextContent>
                        </div>
                      </Card>
                    </div>
                    <Card className={styles.subCard}>
                      <div className={styles.paddingSmall}>
                        <Button variant="link" isInline>
                          View all warnings
                        </Button>
                      </div>
                    </Card>
                  </Card>
                </GridItem>
                <GridItem span={9}>
                  <Card>
                    <div className={styles.paddingBig}>
                      <TextContent>
                        <Text component={TextVariants.h3}>
                          {' '}
                          New Runs
                          <Button variant="link" icon={<UndoAltIcon />} style={{ float: 'right' }}>
                            Refresh results
                          </Button>
                        </Text>
                      </TextContent>
                    </div>
                    <div className={styles.newRunTable}>
                      <Table
                        columns={newDataColumns}
                        rowSelection={rowSelection}
                        expandedRowRender={record => (
                          <p style={{ margin: 0 }}>{record.description}</p>
                        )}
                        dataSource={newData}
                      />
                    </div>
                  </Card>
                </GridItem>
              </Grid>
              <Grid hasGutter style={{ marginTop: '16px' }}>
                <GridItem span={12}>
                  <Card>
                    <div className={styles.paddingSmall}>
                      <TextContent className={styles.paddingSmall}>
                        <Text component={TextVariants.h3}> Unlabled</Text>
                      </TextContent>
                      <Button variant="link">Go to all runs</Button>
                    </div>
                    <div>
                      <Table
                        columns={seenDataColumns}
                        rowSelection={rowSelection}
                        expandedRowRender={record => (
                          <p style={{ margin: 0 }}>{record.description}</p>
                        )}
                        dataSource={unlabledData}
                      />
                    </div>
                  </Card>
                </GridItem>
              </Grid>
            </div>
          </Tab>
          <Tab eventKey={1} title="Visualization">
            <div style={{ marginTop: '32px' }}>
              <TextContent className={styles.paddingSmall}>
                <Grid>
                  <GridItem span={6}>
                    <Text component={TextVariants.h1}> Analysis</Text>
                  </GridItem>
                  <GridItem span={6}>
                    <Text component={TextVariants.h3} style={{ textAlign: 'right' }}>
                      {' '}
                      Total runs: 1,179
                    </Text>
                  </GridItem>
                </Grid>
              </TextContent>
              <Grid>
                <GridItem span={12}>
                  <Card className={styles.borderedCard}>
                    <div className={styles.paddingBig}>
                      <TextContent>
                        <Text component={TextVariants.h2}>
                          {' '}
                          Runs
                          <Button
                            variant="link"
                            icon={<ExternalLinkAltIcon />}
                            style={{ float: 'right' }}
                          >
                            View in Kibana
                          </Button>
                        </Text>
                      </TextContent>
                    </div>
                  </Card>
                  <Card className={styles.borderedCard}>
                    <Grid>
                      <GridItem span={7}>
                        <TextContent className={styles.paddingSmall}>
                          <Text component={TextVariants.h3} style={{ color: 'grey' }}>
                            {' '}
                            Click on sections of the graph to view detailed data
                          </Text>
                        </TextContent>
                        <Grid>
                          <GridItem span={5} offset={1}>
                            <div
                              style={{ height: '260px', width: '260px' }}
                              className={styles.paddingBig}
                            >
                              <ChartDonutThreshold
                                ariaDesc="Storage capacity"
                                ariaTitle="Donut utilization chart with static threshold example"
                                constrainToVisibleArea
                                data={[
                                  { x: 'Warning at 60%', y: 30 },
                                  { x: 'Danger at 90%', y: 90 },
                                ]}
                                labels={({ datum }) => (datum.x ? datum.x : null)}
                              >
                                <ChartDonutUtilization
                                  data={{ x: 'Storage capacity', y: 60 }}
                                  labels={({ datum }) =>
                                    datum.x ? `${datum.x}: ${datum.y}%` : null
                                  }
                                  themeColor={ChartThemeColor.yellow}
                                  thresholds={[{ value: 60 }, { value: 90 }]}
                                />
                              </ChartDonutThreshold>
                            </div>
                          </GridItem>
                          <GridItem span={6}>
                            <div
                              style={{ height: '260px', width: '260px' }}
                              className={styles.paddingBig}
                            >
                              <ChartDonutThreshold
                                ariaDesc="Storage capacity"
                                ariaTitle="Donut utilization chart with static threshold example"
                                constrainToVisibleArea
                                data={[
                                  { x: 'Warning at 60%', y: 30 },
                                  { x: 'Danger at 90%', y: 90 },
                                ]}
                                labels={({ datum }) => (datum.x ? datum.x : null)}
                              >
                                <ChartDonutUtilization
                                  data={{ x: 'Storage capacity', y: 45 }}
                                  labels={({ datum }) =>
                                    datum.x ? `${datum.x}: ${datum.y}%` : null
                                  }
                                />
                              </ChartDonutThreshold>
                            </div>
                          </GridItem>
                        </Grid>
                      </GridItem>
                      <GridItem span={5} style={{ borderLeft: '1px solid #b3b2b2' }}>
                        <div className={styles.paddingBig}>
                          <TextContent>
                            <Text component={TextVariants.h3}>
                              perf102.perf.lab.eng.bos.redhat.com
                            </Text>
                            <Text component={TextVariants.h4}>Field</Text>
                            <a>run.controller</a>
                            <Text component={TextVariants.h4}>Value</Text>
                            <a>scale-ci-http-tfg6k</a>
                            <Text component={TextVariants.h4}>Count</Text>
                            <span>54(3.81%)</span>
                          </TextContent>
                        </div>
                      </GridItem>
                    </Grid>
                  </Card>
                  <Card className={styles.borderedCard}>
                    <div className={styles.paddingBig}>
                      <TextContent>
                        <span>
                          <Text component={TextVariants.h3} style={{ display: 'inline' }}>
                            Legend
                          </Text>
                        </span>
                        <span
                          className={styles.colorBoxInline}
                          style={{ backgroundColor: 'blue' }}
                        />
                        <span className={styles.legendLabel}>ip-172-31-88-27.ec2.internal</span>
                        <span
                          className={styles.colorBoxInline}
                          style={{ backgroundColor: 'green' }}
                        />
                        <span className={styles.legendLabel}>perf44-85qp8-infra-c-6qtbg.c</span>
                        <span
                          className={styles.colorBoxInline}
                          style={{ backgroundColor: 'red' }}
                        />
                        <span className={styles.legendLabel}>
                          dhcp31-25.perf.lab.eng.bos.redhat.com
                        </span>
                        <span
                          className={styles.colorBoxInline}
                          style={{ backgroundColor: 'violet' }}
                        />
                        <span className={styles.legendLabel}>
                          frival-l64sv2-rhel8-Standard-L64s-v2-1-vm
                        </span>
                        <span
                          className={styles.colorBoxInline}
                          style={{ backgroundColor: '#f0ab00' }}
                        />
                        <span className={styles.legendLabel}>scale-ci-http-dzms4</span>
                      </TextContent>
                    </div>
                  </Card>
                </GridItem>
              </Grid>
              <Grid>
                <GridItem span={12}>
                  <Card className={styles.borderedCard}>
                    <div className={styles.paddingBig}>
                      <TextContent>
                        <Text component={TextVariants.h2}>
                          {' '}
                          Runs over time
                          <Button
                            variant="link"
                            icon={<ExternalLinkAltIcon />}
                            style={{ float: 'right' }}
                          >
                            View in Kibana
                          </Button>
                        </Text>
                      </TextContent>
                    </div>
                  </Card>
                  <Card className={styles.borderedCard}>
                    <Grid>
                      <GridItem span={8}>
                        <TextContent className={styles.paddingSmall}>
                          <Text component={TextVariants.h4} style={{ color: 'grey' }}>
                            {' '}
                            @metadata.satellite.EC2: filters
                          </Text>
                        </TextContent>
                        <Grid>
                          <div className={styles.borderedCard}>
                            <Chart
                              ariaDesc="mock metdata"
                              ariaTitle="mock meta data"
                              containerComponent={
                                <ChartVoronoiContainer
                                  labels={({ datum }) => `${datum.name}: ${datum.y}`}
                                  constrainToVisibleArea
                                />
                              }
                              domainPadding={{ x: [50, 50] }}
                              height={500}
                              padding={{
                                bottom: 50,
                                left: 50,
                                right: 200,
                                top: 50,
                              }}
                              width={1200}
                            >
                              <ChartAxis />
                              <ChartAxis dependentAxis showGrid />
                              <ChartStack>
                                <ChartBar
                                  data={[
                                    { name: 'meta1', x: '5-10-2020', y: 100 },
                                    { name: 'meta1', x: '6-10-2020', y: 100 },
                                    { name: 'meta1', x: '7-10-2020', y: 70 },
                                    { name: 'meta1', x: '8-10-2020', y: 10 },
                                    { name: 'meta2', x: '9-10-2020', y: 50 },
                                    { name: 'meta2', x: '10-10-2020', y: 50 },
                                    { name: 'meta2', x: '11-10-2020', y: 30 },
                                    { name: 'meta3', x: '12-10-2020', y: 50 },
                                    { name: 'meta2', x: '13-10-2020', y: 50 },
                                    { name: 'meta2', x: '14-10-2020', y: 30 },
                                    { name: 'meta3', x: '15-10-2020', y: 150 },
                                    { name: 'meta2', x: '16-10-2020', y: 50 },
                                  ]}
                                  barWidth={barWidth}
                                />
                                <ChartBar
                                  data={[
                                    { name: 'meta1', x: '5-10-2020', y: 100 },
                                    { name: 'meta1', x: '7-10-2020', y: 57 },
                                    { name: 'meta1', x: '8-10-2020', y: 40 },
                                    { name: 'meta1', x: '9-10-2020', y: 20 },
                                    { name: 'meta2', x: '10-10-2020', y: 120 },
                                    { name: 'meta2', x: '11-10-2020', y: 90 },
                                    { name: 'meta2', x: '12-10-2020', y: 0 },
                                    { name: 'meta3', x: '13-10-2020', y: 70 },
                                    { name: 'meta2', x: '14-10-2020', y: 50 },
                                    { name: 'meta2', x: '15-10-2020', y: 30 },
                                    { name: 'meta3', x: '16-10-2020', y: 150 },
                                  ]}
                                  barWidth={barWidth}
                                />
                              </ChartStack>
                            </Chart>
                          </div>
                          <TextContent className={styles.paddingSmall}>
                            <Text component={TextVariants.h4} style={{ color: 'grey' }}>
                              {' '}
                              NOT @metadata.satellite.EC2: filters
                            </Text>
                          </TextContent>
                          <div className={styles.borderedCard}>
                            <Chart
                              ariaDesc="mock meta data"
                              ariaTitle="mock meta data"
                              containerComponent={
                                <ChartVoronoiContainer
                                  labels={({ datum }) => `${datum.name}: ${datum.y}`}
                                  constrainToVisibleArea
                                />
                              }
                              domainPadding={{ x: [50, 50] }}
                              height={500}
                              padding={{
                                bottom: 50,
                                left: 50,
                                right: 200,
                                top: 50,
                              }}
                              themeColor={ChartThemeColor.gold}
                              width={1200}
                            >
                              <ChartAxis />
                              <ChartAxis dependentAxis showGrid />
                              <ChartStack>
                                <ChartBar
                                  data={[
                                    { name: 'meta1', x: '5-10-2020', y: 50 },
                                    { name: 'meta1', x: '6-10-2020', y: 200 },
                                    { name: 'meta1', x: '7-10-2020', y: 70 },
                                    { name: 'meta1', x: '8-10-2020', y: 100 },
                                    { name: 'meta2', x: '9-10-2020', y: 50 },
                                    { name: 'meta2', x: '10-10-2020', y: 50 },
                                    { name: 'meta2', x: '11-10-2020', y: 30 },
                                    { name: 'meta3', x: '12-10-2020', y: 150 },
                                    { name: 'meta2', x: '13-10-2020', y: 50 },
                                    { name: 'meta2', x: '14-10-2020', y: 30 },
                                    { name: 'meta3', x: '15-10-2020', y: 150 },
                                  ]}
                                  barWidth={barWidth}
                                />
                                <ChartBar
                                  data={[
                                    { name: 'meta1', x: '5-10-2020', y: 100 },
                                    { name: 'meta1', x: '6-10-2020', y: 104 },
                                    { name: 'meta1', x: '7-10-2020', y: 70 },
                                    { name: 'meta1', x: '8-10-2020', y: 110 },
                                    { name: 'meta2', x: '9-10-2020', y: 50 },
                                    { name: 'meta2', x: '10-10-2020', y: 60 },
                                    { name: 'meta2', x: '11-10-2020', y: 30 },
                                    { name: 'meta3', x: '12-10-2020', y: 50 },
                                    { name: 'meta2', x: '13-10-2020', y: 50 },
                                    { name: 'meta2', x: '14-10-2020', y: 30 },
                                    { name: 'meta3', x: '15-10-2020', y: 150 },
                                  ]}
                                  barWidth={barWidth}
                                />
                              </ChartStack>
                            </Chart>
                          </div>
                        </Grid>
                      </GridItem>
                      <GridItem span={4} style={{ borderLeft: '1px solid #b3b2b2' }}>
                        <div className={styles.paddingBig}>
                          <TextContent>
                            <span>
                              <Text component={TextVariants.h3}>Legend</Text>
                            </span>
                            <div>
                              <span
                                className={styles.colorBox}
                                style={{ backgroundColor: 'blue' }}
                              />
                              <span className={styles.legendLabel}>pbench-user-benchmark</span>
                            </div>
                            <div>
                              <span
                                className={styles.colorBox}
                                style={{ backgroundColor: 'green' }}
                              />
                              <span className={styles.legendLabel}>trafficgen</span>
                            </div>
                            <div>
                              <span
                                className={styles.colorBox}
                                style={{ backgroundColor: 'red' }}
                              />
                              <span className={styles.legendLabel}>uperf</span>
                            </div>
                            <div>
                              <span
                                className={styles.colorBox}
                                style={{ backgroundColor: 'violet' }}
                              />
                              <span className={styles.legendLabel}>linpack</span>
                            </div>
                            <div>
                              <span
                                className={styles.colorBox}
                                style={{ backgroundColor: '#f0ab00' }}
                              />
                              <span className={styles.legendLabel}>fio</span>
                            </div>
                          </TextContent>
                        </div>
                      </GridItem>
                    </Grid>
                  </Card>
                </GridItem>
              </Grid>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Overview;
