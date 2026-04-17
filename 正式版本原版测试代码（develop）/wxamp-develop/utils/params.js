const debug = false //模式
const version = "3.0.0" //版本
const logOutput = false //网络请求日志输出

//https://welfare-api-develop.dev.moveclub.cn/
//http://welfare.api.test
const apihost =  debug ? 'http://alpha.movewell.api.51ydb.cn/' :'http://alpha.movewell.api.51ydb.cn/'
const apihost2 =  debug ? 'https://alpha.api.mdc.movecloud.cn/' :'https://welfare-api-master.sc.moveclub.cn/'
const viewhost = 'https://bk.h5.movecloud.cn/'
const app = 202    //将194改成202访问接口，原来的194是每步内部开发使用的
const gid = 'U1BtaGs3eXl3dDA9'
const uploadurl = 'https://movewell.api.51ydb.cn/api/fileupload'
const uploadurl2 = 'https://movewell.api.51ydb.cn/api/medicalupload'
//导出
module.exports = {
	app:app,
    gid:gid,
	debug: debug,
	version: version,
	logOutput: logOutput,
	apihost: apihost,
	apihost2: apihost2,
	viewhost: viewhost,
	uploadurl: uploadurl,
	uploadurl2: uploadurl2,
	host: 'https://address.sc.moveclub.cn/'
}