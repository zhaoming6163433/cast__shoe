/**
 * 配置编译环境和线上环境之间的切换
 *
 * urlWebHttp: 域名地址
 * toastime: toast时间
 *
 */
const toastime = 3000;
const timeout = 10000;

let urlWebHttp;
let plant = '';

console.log(process.env)

switch (process.env.srconfig) {
	case 'dev':
		urlWebHttp = 'http://10.6.80.94';
		break;
	case 'beta':
		urlWebHttp = 'https://devo2o.zhiscity.com';
		break;
	case 'pro':
		urlWebHttp = 'http://socket.todaypocket.cn';
		break;
	case 'testdev':
		urlWebHttp = 'https://devtesto2o.zhiscity.com';
        break;
	default://默认开发
		urlWebHttp = 'http://10.13.48.28:3011';
        break;
}
//判断平台
if(navigator.userAgent.match(/MicroMessenger/igm)){
	plant = 'weixin';
}


export default{
	urlWebHttp,
	toastime,
	timeout,
	plant
}
