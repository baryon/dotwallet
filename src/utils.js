"use strict";
const md5 = require( "md5" );
const crypto = require( "crypto" );


const SupportCoinType = {
  "BTC": "BTC",
  "BSV": "BSV",
  "ETH": "ETH"
}


class DWError extends Error {
  constructor ( code, msg ) {
    super( msg );
    this.name = 'DotWalletError';
  }
}

function CreateSignature ( queryData, app_secret ) {
  let str = "";
  const secret = md5( app_secret );
  for ( let key in queryData ) {
    if ( key != "sign" && key != "opreturn" ) {
      if ( str ) {
        str += "&" + key + "=" + queryData[ key ];
      }
      else {
        str = key + "=" + queryData[ key ];
      }
    }
  }
  str += "&secret=" + secret;
  str = str.toUpperCase();
  const sign = crypto
    .createHmac( "sha256", secret )
    .update( str, "utf8" )
    .digest( "hex" );
  return sign;
}

module.exports = {
  DWError: DWError,
  SupportCoinType: SupportCoinType,
  CreateSignature: CreateSignature
}
