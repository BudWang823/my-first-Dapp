// SPDX-License-Identifier: GPL - 3.0
pragma solidity >=0.4.16 <0.9.0; // 限定solidity编译器版本
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./WzToken.sol";

contract Exchange {
    using SafeMath for uint256;
    // 交易所收费账户
    address public feeAccount;
    // 费率
    uint256 public feePercent;
    address public constant ETHER = address(0);
    // 交易所存储货币及各种货币数量
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => bool) public orderCancel;
    mapping(uint256 => bool) public orderFill;
    // 交易所授权币种
    // mapping(address => address) public allow
    // 订单结构体
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }
    // 创建订单事件
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    // 取消订单事件
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    // 完成订单事件
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    // _Order[] orders;
    mapping(uint256 => _Order) public orders;
    uint256 orderCount;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
        orderCount = 0;
    }

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    /*
        交易所内转账
        @params _token  币的地址
        @params _to     转入账号地址
        @params _amount 转账数量
    */ 
    function transfer(address _token, address _to, uint _amount) public {
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        tokens[_token][_to] = tokens[_token][_to].add(_amount);
    }

    // 查询余额
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }

    // 存储以太坊
    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 存储其他货币
    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(
            WzToken(_token).transferFrom(msg.sender, address(this), _amount)
        );
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 提取eth
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(WzToken(_token).transfer(msg.sender, _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function makeOrder(
        address _tokenGet,
        uint256 _tokenGetAmount,
        address _tokenGive,
        uint256 _tokenGiveAmount
    ) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _tokenGetAmount,
            _tokenGive,
            _tokenGiveAmount,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _tokenGetAmount,
            _tokenGive,
            _tokenGiveAmount,
            block.timestamp
        );
        // 发出订单事件
    }

    function cancelOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        orderCancel[_id] = true;
        emit Cancel(
            myOrder.id,
            msg.sender,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            block.timestamp
        );
    }

    function fillOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        orderFill[_id] = true;
        // 手续费收取 && 账户余额互换
        // 手续费
        uint256 feeAmount = myOrder.amountGet.mul(feePercent).div(100);

        /*
            小明 makeorder

            100WZT => 1ETH
            小明  WZT -100
                 ETH +1


            msg.sender fillOrder

            msg.sender  WZT +100
                        ETH -1
        */
        // 小明  WZT -100 - 手续费
        tokens[myOrder.tokenGet][myOrder.user] = tokens[myOrder.tokenGet][
            myOrder.user
        ].sub(myOrder.amountGet.add(feeAmount));
        // 小明  ETH + 1
        tokens[myOrder.tokenGive][myOrder.user] = tokens[myOrder.tokenGive][
            myOrder.user
        ].add(myOrder.amountGive);
        // msg.sender WZT +100
        tokens[myOrder.tokenGet][msg.sender] = tokens[myOrder.tokenGet][
            msg.sender
        ].add(myOrder.amountGet);
        // msg.sender ETH -1
        tokens[myOrder.tokenGive][msg.sender] = tokens[myOrder.tokenGive][
            msg.sender
        ].sub(myOrder.amountGive);
        // 手续费收取到收费账户
        tokens[myOrder.tokenGet][feeAccount] = tokens[myOrder.tokenGet][
            feeAccount
        ].add(feeAmount);

        emit Trade(
            myOrder.id,
            myOrder.user,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            block.timestamp
        );
    }
}
