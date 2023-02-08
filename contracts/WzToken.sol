// SPDX-License-Identifier: GPL - 3.0
pragma solidity >=0.4.16 <0.9.0; // 限定solidity编译器版本
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract WzToken {
    using SafeMath for uint256; //为了uint256扩展sub  add 方法
    string public name = "WzToken";
    string public symbol = "WZT";

    uint256 public decimals = 18;
    uint256 public totaSupply;

    /*记录所有余额的映射*/
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        totaSupply = 1000000 * (10**decimals);
        // 部署账号
        balanceOf[msg.sender] = totaSupply;
    }

    /* 在区块链上创建一个事件，用以通知客户端*/
    event Transfer(address indexed from, address indexed to, uint256 value); //转账通知事件
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    ); //设置允许用户支付最大金额通知

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        // _spender 交易所地址
        // msg.sender 授权账号地址
        // _value 授权所得钱数
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //被授权得交易所调用
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        //_from 某个放款账号
        //_to   收款账户
        //msg.sender 交易所账户地址
        require(balanceOf[_from]>=_value);
        require(allowance[_from][msg.sender]>=_value);

        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}
