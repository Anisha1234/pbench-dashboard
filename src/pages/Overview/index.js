import React from 'react';
import { routerRedux } from 'dva/router';
import {
  Grid,
  GridItem,
  Card,
  TextContent,
  Text,
  TextVariants,
  Button,
  Progress,
  ProgressSize,
  ProgressMeasureLocation,
  ProgressVariant,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
} from '@patternfly/react-core';
import { Icon } from 'antd';
import { connect } from 'dva';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutlinedClockIcon, UndoAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { resultData, expirationLimit, expiringSoonResults } from '../../../mock/overview';
import { getDiffDays } from '../../utils/moment_constants';
import Table from '@/components/Table';
import styles from './index.less';

@connect(({ user }) => ({
  user: user.user,
  favoriteControllers: user.favoriteControllers,
  seenResults: user.seenResults,
}))
class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManageRunDropdownOpen: false,
      totalResultData: resultData,
      newData: [],
      unlabledData: [],
    };
  }

  componentDidMount() {
    this.getRunResult();
  }

  getRunResult() {
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetchPrivateResults',
      payload: totalResultData,
    });
    this.getSeperatedResults();
  }

  getSeperatedResults() {
    const { totalResultData } = this.state;
    const unlabledData = totalResultData.filter(x => x.saved === true);
    const newData = totalResultData.filter(x => x.saved !== true);
    this.setState({
      newData,
      unlabledData,
    });
  }

  favoriteRecord = (event, value, controller) => {
    // Stop propagation from going to the next page
    event.stopPropagation();
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/favoriteController',
      payload: controller,
    });
  };

  removeControllerFromFavorites = (event, value, controller) => {
    // Stop propagation from going to the next page
    event.stopPropagation();
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/removeControllerFromFavorites',
      payload: controller,
    });
  };

  showDrowpdown = id => {
    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  saveRuns = row => {
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    const objIndex = totalResultData.findIndex(x => x.key === row.key);
    totalResultData[objIndex].saved = true;
    this.setState(
      {
        totalResultData,
      },
      () => {
        dispatch({
          type: 'global/updatePrivateControllers',
          payload: totalResultData,
        });
        this.getSeperatedResults();
      }
    );
  };

  deleteResult = row => {
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    const updatedResult = totalResultData.filter(x => x.key !== row.key);
    this.setState(
      {
        totalResultData: updatedResult,
      },
      () => {
        dispatch({
          type: 'global/updateSelectedResults',
          payload: totalResultData,
        });
        this.getSeperatedResults();
      }
    );
  };

  onToggleManageRunDropdown = isManageRunDropdownOpen => {
    this.setState({
      isManageRunDropdownOpen,
    });
  };

  onSelectManageRunDropdown = () => {
    const { isManageRunDropdownOpen } = this.state;
    this.setState({
      isManageRunDropdownOpen: !isManageRunDropdownOpen,
    });
  };

  navigateToRunResult = (text, row) => {
    const { dispatch } = this.props;
    this.markResultSeen(row);
    dispatch({
      type: 'global/updateSelectedResults',
      payload: text,
    }).then(() => {
      dispatch(
        routerRedux.push({
          pathname: 'private/runresults',
        })
      );
    });
  };

  navigateToExpiringResult = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: 'private/expiringresults',
      })
    );
  };

  markResultSeen = controller => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/markResultSeen',
      payload: controller,
    });
  };

  removeResultFromSeen = controller => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/removeResultFromSeen',
      payload: controller,
    });
  };

  render() {
    const { newData, unlabledData, isManageRunDropdownOpen } = this.state;
    const { favoriteControllers, seenResults } = this.props;

    const newDataColumns = [
      {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
        render: (text, row) => {
          let isSeen = false;
          if (seenResults !== []) {
            seenResults.forEach(item => {
              if (item.key === row.key) {
                isSeen = true;
              }
            });
          }
          if (isSeen) {
            return (
              <div>
                <Button
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px' }}
                  onClick={() => this.navigateToRunResult(text[0], row)}
                >
                  {text[0]}
                </Button>
                <br />
                <Text component={TextVariants.p} className={styles.subText}>
                  <span className={styles.label}>{text[1]}</span>
                </Text>
              </div>
            );
          }
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.navigateToRunResult(text[0], row)}
              >
                <b>{text[0]}</b>
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
        title: 'Scheduled for deletion on',
        dataIndex: 'deletion',
        key: 'deletion',
        render: text => {
          const remainingDays = getDiffDays(text);
          if (remainingDays > 45) {
            return (
              <div>
                <Text>{text}</Text>
                <Progress
                  min={0}
                  max={expirationLimit}
                  value={expirationLimit - remainingDays}
                  size={ProgressSize.sm}
                  measureLocation={ProgressMeasureLocation.none}
                />
              </div>
            );
          }
          return (
            <div>
              <span>{text}</span>
              <Progress
                min={0}
                max={expirationLimit}
                value={expirationLimit - remainingDays}
                size={ProgressSize.sm}
                variant={ProgressVariant.danger}
                measureLocation={ProgressMeasureLocation.none}
              />
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'fav',
        key: 'fav',
        render: (value, row) => {
          let isFavorite = false;
          favoriteControllers.forEach(item => {
            if (item.key === row.key) {
              isFavorite = true;
            }
          });
          if (isFavorite) {
            return (
              <a onClick={e => this.removeControllerFromFavorites(e, null, row)}>
                <Icon type="star" theme="filled" />
              </a>
            );
          }
          return (
            <a onClick={e => this.favoriteRecord(e, null, row)}>
              <Icon type="star" />
            </a>
          );
        },
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
                  <div className={styles.dropdownLink} onClick={() => this.saveRuns(row)}>
                    Save Runs
                  </div>
                  <div
                    className={styles.dropdownLink}
                    onClick={() => this.removeControllerFromSeen(row)}
                  >
                    Mark unread
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
        render: (text, row) => {
          let isSeen = false;
          if (seenResults !== []) {
            seenResults.forEach(item => {
              if (item.key === row.key) {
                isSeen = true;
              }
            });
          }
          if (isSeen) {
            return (
              <div>
                <Button
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px' }}
                  onClick={() => this.navigateToRunResult(text[0], row)}
                >
                  {text[0]}
                </Button>
                <br />
                <Text component={TextVariants.p} className={styles.subText}>
                  <span className={styles.label}>{text[1]}</span>
                </Text>
              </div>
            );
          }
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.navigateToRunResult(text[0], row)}
              >
                <b>{text[0]}</b>
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
        title: 'Scheduled for deletion on',
        dataIndex: 'deletion',
        key: 'deletion',
        render: text => {
          const remainingDays = getDiffDays(text);
          if (remainingDays > 45) {
            return (
              <div>
                <Text>{text}</Text>
                <Progress
                  min={0}
                  max={expirationLimit}
                  value={expirationLimit - remainingDays}
                  size={ProgressSize.sm}
                  measureLocation={ProgressMeasureLocation.none}
                />
              </div>
            );
          }
          return (
            <div>
              <span>{text}</span>
              <Progress
                min={0}
                max={expirationLimit}
                value={expirationLimit - remainingDays}
                size={ProgressSize.sm}
                variant={ProgressVariant.danger}
                measureLocation={ProgressMeasureLocation.none}
              />
            </div>
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '',
        dataIndex: 'fav',
        key: 'fav',
        render: (value, row) => {
          let isFavorite = false;
          favoriteControllers.forEach(item => {
            if (item.key === row.key) {
              isFavorite = true;
            }
          });
          if (isFavorite) {
            return (
              <a onClick={e => this.removeControllerFromFavorites(e, null, row)}>
                <Icon type="star" theme="filled" />
              </a>
            );
          }
          return (
            <a onClick={e => this.favoriteRecord(e, null, row)}>
              <Icon type="star" />
            </a>
          );
        },
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
                  <div className={styles.dropdownLink}>Mark unread</div>
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
      onChange: () => {},
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    const expiringSoonTable = expiringSoonResults.map(function(result) {
      return (
        <Card className={styles.subCard}>
          <div className={styles.paddingSmall}>
            <TextContent>
              <Button variant="link" isInline>
                {result.result[0]}
              </Button>
              <Text component={TextVariants.p} className={styles.subText}>
                <OutlinedClockIcon className={styles.icons} /> {result.result[1]}
              </Text>
            </TextContent>
          </div>
        </Card>
      );
    });

    const manageRunDropdown = [
      <DropdownItem key="save" className={styles.ulclass}>
        {' '}
        Save Runs
      </DropdownItem>,
      <DropdownItem key="unread" className={styles.ulclass}>
        {' '}
        Mark as unread
      </DropdownItem>,
      <DropdownItem key="favourite" className={styles.ulclass}>
        Mark Favourited
      </DropdownItem>,
      <DropdownSeparator key="separator" />,
      <DropdownItem key="delete" className={styles.ulclass}>
        Delete runs
      </DropdownItem>,
    ];

    return (
      <div className={styles.paddingBig}>
        <TextContent className={styles.paddingSmall}>
          <Text component={TextVariants.h1}> Overview</Text>
        </TextContent>
        <Grid hasGutter>
          <GridItem span={3}>
            <Card className={styles.parallalCard}>
              <div className={styles.expiringValues}>
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
                {expiringSoonTable}
              </div>
              <Card className={styles.subCard}>
                <div className={styles.paddingSmall}>
                  <Button variant="link" isInline onClick={() => this.navigateToExpiringResult()}>
                    View all warnings
                  </Button>
                </div>
              </Card>
            </Card>
          </GridItem>
          <GridItem span={9}>
            <Card className={styles.parallalCard}>
              <div className={styles.paddingBig}>
                <TextContent>
                  <Text component={TextVariants.h3}>
                    {' '}
                    New and unmanaged Runs
                    <span style={{ float: 'right' }}>
                      <Button
                        variant="link"
                        icon={<UndoAltIcon />}
                        onClick={() => this.getRunResult()}
                      >
                        Refresh results
                      </Button>
                      <Dropdown
                        onSelect={this.onSelectManageRunDropdown}
                        toggle={
                          <DropdownToggle
                            onToggle={this.onToggleManageRunDropdown}
                            toggleIndicator={CaretDownIcon}
                            isPrimary
                            id="toggle-id-4"
                          >
                            Manage runs
                          </DropdownToggle>
                        }
                        isOpen={isManageRunDropdownOpen}
                        dropdownItems={manageRunDropdown}
                      />
                    </span>
                  </Text>
                </TextContent>
              </div>
              <div className={styles.newRunTable}>
                <Table
                  columns={newDataColumns}
                  rowSelection={rowSelection}
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
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
                  <Text component={TextVariants.h3}> Saved Runs</Text>
                </TextContent>
                <Button variant="link">Go to all runs</Button>
              </div>
              <div>
                <Table
                  columns={seenDataColumns}
                  rowSelection={rowSelection}
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                  dataSource={unlabledData}
                />
              </div>
            </Card>
          </GridItem>
        </Grid>
      </div>
    );
  }
}

export default Overview;
