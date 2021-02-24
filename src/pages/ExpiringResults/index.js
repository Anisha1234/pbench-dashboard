import React, { Component } from 'react';
import { connect } from 'dva';
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
} from '@patternfly/react-core';
import { Icon } from 'antd';
import moment from 'moment';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { resultData, expirationLimit } from '../../../mock/overview';
import Table from '@/components/Table';
import styles from './index.less';

@connect(({ user }) => ({
  user: user.user,
  favoriteControllers: user.favoriteControllers,
}))
class ExpiringResults extends Component {
  showDrowpdown = id => {
    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  render() {
    const { favoriteControllers } = this.props;
    const seenDataColumns = [
      {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
        render: text => (
          <div>
            <Button
              variant="link"
              isInline
              style={{ marginBottom: '8px' }}
              onClick={() => this.navigateToRunResult(text[0])}
            >
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
          const remainingDays = deleteDate.diff(currDate, 'days');
          if (remainingDays > 45) {
            return (
              <div>
                <Text>
                  {moment(text)
                    .add(7, 'days')
                    .format('YYYY-MM-DDTHH:mm:ss:SSSSSS')}
                </Text>
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
              <span>
                {moment(text)
                  .add(7, 'days')
                  .format('YYYY-MM-DDTHH:mm:ss:SSSSSS')}
              </span>
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
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <React.Fragment>
        <div className={styles.paddingBig}>
          <TextContent className={styles.paddingSmall}>
            <Text component={TextVariants.h1}> All runs</Text>
          </TextContent>
          <Grid hasGutter style={{ marginTop: '16px' }}>
            <GridItem span={12}>
              <Card>
                <div>
                  <Table
                    columns={seenDataColumns}
                    rowSelection={rowSelection}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={resultData}
                  />
                </div>
              </Card>
            </GridItem>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default ExpiringResults;
