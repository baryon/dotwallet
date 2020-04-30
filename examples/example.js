const DW = require( '..' )
const uuid = require( 'uuid' )
const testAppID = '5a192d599b0be66bdb2ef72784acb0f8';
const testAppSecret = 'b71557823ce2b25d07fb186368999181';

console.log( DW )

//托管数据上链服务可不需要填写options
const option = {
  redirectURI: 'http://localhost.com:8001',
  noticeURI: 'http://localhost.com:8002',
  checkOrderURI: 'http://localhost.com:8003',
  merchantName: '测试开发者',
  receiveAddress: '1QG3jKAt5qt41yVEm7JfMraJ1YZ5WpY8Wx', //商家默认收款地址
  isMobile: true,
  domain: DW.DomainOption.CN
};

const merchant = new DW.DWMerchant( testAppID, testAppSecret, option );

//下普通订单
async function createOrder () {
  const orderSN = uuid.v4();//订单号
  const itemPrice = 2000; //商品价格,单位:聪
  const recvAddr = '1QG3jKAt5qt41yVEm7JfMraJ1YZ5WpY8Wx'; //收款地址
  const itemName = '商品名称:一个苹果';
  const opreturn = '这是一笔普通订单,购买了一个苹果'; //可以为商量自己组装的交易脚本,此情况下必须为hex 字符串
  let rst = await merchant.CreateOrder( orderSN, itemName, itemPrice, opreturn );
  console.log( rst.data.redirectURL );
  console.log( merchant.GetUserPayURL( rst.data.orderSN ) );
}


createOrder();