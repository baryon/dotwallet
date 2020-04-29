"use strict";
const axios = require( "axios" );
const utils = require( "./utils" );

const DomainOption = {
  "CN": "https://www.ddpurse.com",
  "HK": "https://overseas.ddpurse.com"
}

class DWMerchant {
  constructor ( appID, secret, opts ) {
    this.m_users = [];
    this.m_mapUsers = new Map();
    this.m_depositCoinType = utils.SupportCoinType.BSV;
    this.m_depositAddress = '';
    this.m_appID = appID;
    this.m_secret = secret;
    const defaultOpts = {
      redirectURI: '',
      noticeURI: '',
      checkOrderURI: '',
      receiveAddress: '',
      merchantName: '',
      timeOut: 5000,
      isMobile: false,
      domain: DomainOption.CN
    };
    opts = opts || defaultOpts;
    this.m_redirectURI = opts.redirectURI || '';
    this.m_noticeURI = opts.noticeURI || '';
    this.m_checkOrderURI = opts.checkOrderURI || '';
    this.m_merchantName = opts.merchantName || "unkown";
    this.m_receiveAddr = opts.receiveAddress || '';
    this.m_timeout = opts.timeOut || 5000;
    DWMerchant.DotWalletOpenURL = opts.domain || defaultOpts.domain;
    this.m_opts = opts;
  }
  GetUserPayURL ( orderSN ) {
    let getURL;
    if ( this.m_opts.isMobile ) {
      getURL = new URL( "wallet/open/pay", DWMerchant.DotWalletOpenURL );
    }
    else {
      getURL = new URL( "desktop/open/order", DWMerchant.DotWalletOpenURL );
    }
    getURL.searchParams.append( 'order_sn', orderSN );
    return getURL.href;
  }
  /**
   * 创建订单号,并返回用户授权URL
   * @param orderSN
   * @param itemName
   * @param payAmount
   * @param opreturnHex
   * @param receiveAddress
   * @returns redirect url
   * <a href="https://www.ddpurse.com/desktop/open/order?order_sn=948a19d6b779b2abcfd21c0fa0a9a615">https://www.ddpurse.com/desktop/open/order?order_sn=948a19d6b779b2abcfd21c0fa0a9a615</a>
   */
  CreateOrder ( orderSN, itemName, payAmount, opreturnHex, receiveAddress ) {
    let recvMuti = [ {
      address: receiveAddress || this.m_receiveAddr,
      amount: payAmount
    } ];
    return this.CreateOrderMuti( orderSN, itemName, payAmount, recvMuti, opreturnHex );
  }
  CreateOrderMuti ( orderSN, itemName, payAmount, receiveMuti, opreturnHex ) {
    let order = {
      app_id: this.m_appID,
      merchant_order_sn: orderSN,
      item_name: itemName,
      order_amount: payAmount,
      nonce_str: new Date().getTime().toString(),
      sign: '',
      notice_uri: this.m_noticeURI,
      redirect_uri: this.m_redirectURI,
      check_order_uri: this.m_checkOrderURI,
      opreturn: opreturnHex,
      receive_address: JSON.stringify( receiveMuti ),
    };
    order.sign = utils.CreateSignature( order, this.m_secret );
    const orderURL = new URL( "openapi/apply_order", DWMerchant.DotWalletOpenURL );
    console.log(orderURL)
    return axios.post( orderURL.href, order, {
      timeout: this.m_timeout,
      headers: {
        'Content-Type': 'application/json',
      }
    } )
      .then( function ( res ) {
        //console.log( res.status, res.headers, res.request.res.responseUrl );
        const redirectURL = new URL( res.request.res.responseUrl );
        let rst = {
          code: 0,
          msg: 'ok',
          data: {
            order_sn: redirectURL.searchParams.get( 'order_sn' )
          }
        };
        return rst
      } )
  }
}

module.exports = {
  DomainOption: DomainOption,
  DWMerchant: DWMerchant
}
