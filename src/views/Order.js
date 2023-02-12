import React from 'react'
import { Table, Card, Row, Co, Col } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
export default function Order() {
  const {AllOrder} = useSelector(state => state.order)


  const columnsAllOrder = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'time',
    },
    {
      title: 'WZT',
      dataIndex: 'age',
      key: 'wzt',
    },
    {
      title: 'ETH',
      dataIndex: 'address',
      key: 'eth',
    },
  ];

  return (
    <div>
      <Row>
        <Col span={8}>
          <Card title="已完成交易" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            <Table dataSource={AllOrder} columns={columnsAllOrder} />;
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易中-我的订单" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            {/* <Table dataSource={dataSource} columns={columns} />; */}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易中-其他人订单" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            {/* <Table dataSource={dataSource} columns={columns} />; */}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
