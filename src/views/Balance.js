import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fromWei } from '../utils/util'
import {  Row, Col, Card, Statistic } from "antd"
// import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
export default function Balance() {
  const { TokenWallet, TokenExchange, EtherWallet, EtherExchange } = useSelector(state => state.balance)
  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic title="钱包 WZT" value={fromWei(TokenWallet)} precision={4} valueStyle={{ color: '#3f8600'}} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic title="钱包 ETH" value={fromWei(EtherWallet)} precision={4} valueStyle={{ color: '#1677ff'}} />
          </Card> 
        </Col><Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic title="交易所 WZT" value={fromWei(TokenExchange)} precision={4} valueStyle={{ color: '#faad14'}} />
          </Card>
        </Col><Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic title="交易所 ETH" value={fromWei(EtherExchange)} precision={4} valueStyle={{ color: '#cf1332'}} />
          </Card>
        </Col>
      </Row>
    </div>

  )
} 
