var login = require('./login/login')
var Session = require('./login/session')
var request = require('./login/request')
var utils = require('./login/utils.js')

module.exports = {
  login:login.login,
  Session:Session,
  clearSession:Session.clear,
  request:request.request,
  extend:utils.extend
}