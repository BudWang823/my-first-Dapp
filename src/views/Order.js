import React from 'react'
import { Table, Card, Row, Col, Button } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fromWei } from "../utils/util"
const getRenderOrders = (order, type) => {
  if (!window.web) return []
  // 所有已经取消 已经完成订单
  const filterIds = [...order.CancelOrder, ...order.FillOrder].map(item => item.id)
  // 交易中订单
  const pendingOrders = order.AllOrder.filter(item => !filterIds.includes(item.id))
  let result
  if (type === '01') {
    result = pendingOrders.filter(item => item.user === window.web.account)
  } else if (type === '02') {
    result = pendingOrders.filter(item => item.user !== window.web.account)
  }
  return result
}
export default function Order() {
  const order = useSelector(state => state.order)
  const columnsOrder = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'id',
      render: (_, t) => <span>{moment(t).format("YYYY-MM-DD")}</span>
    },
    {
      title: 'pay token',
      dataIndex: 'amountPay',
      key: 'id',
      render: amountPay => <b>{fromWei(amountPay)}</b>
    },
    {
      title: 'get token',
      dataIndex: 'amountGet',
      key: 'id',
      render: amountGet => <b>{fromWei(amountGet)}</b>
    },
  ];
  const columnsOrder1 = [
    ...columnsOrder,
    {
      title: '操作',
      render: (item) => <Button size="small" type="primary" onClick={async () => {
        const { account, wzTokenContract, exchangeContract } = window.web
        const a = await exchangeContract.methods.cancelOrder(item.id).send({
          from: account
        })
      }}>取消</Button>
    }
  ]
  const columnsOrder2 = [
    ...columnsOrder,
    {
      title: '操作',
      render: (item) => <Button size="small" danger onClick={async () => {
        const { account, wzTokenContract, exchangeContract } = window.web
        console.log(exchangeContract)
        const a = await exchangeContract.methods.fillOrder(item.id).send({ 
          from: account
        })
      }}>购买</Button>
    }
  ]

  return (
    <div>
      <Row>
        <Col span={8}>
          <Card title="已完成交易" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            <Table dataSource={order.FillOrder} columns={columnsOrder} rowKey={item => item.id} />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易中-我的订单" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            <Table dataSource={getRenderOrders(order, '01')} columns={columnsOrder1} rowKey={item => item.id} />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="交易中-其他人订单" bordered={false} style={{ margin: '10px' }} hoverable={true}>
            <Table dataSource={getRenderOrders(order, '02')} columns={columnsOrder2} rowKey={item => item.id} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
