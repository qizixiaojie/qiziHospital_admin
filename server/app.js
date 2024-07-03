const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const UserRouter = require('./routes/admin/UserRouter')
const JWT = require('./util/JWT')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use(UserRouter) // 挂载 UserRouter
/*
admin 后台系统用的
webapi 企业官网用的
*/

//注册中间键，使他们检测token的值
app.use((req, res, next) => {
  //如果token有效，next（）
  //如果token过期了，放回401错误
  if (req.url === '/adminapi/user/login') {
    next()
    return
  }
  const token = req.headers['authorization'].split(' ')[1]
  console.log(req.headers['authorization'])
  if (token) {
    var payload = JWT.verify(token)
    //如果token有效就执行再次获取新的时间的token进行加密
    if (payload) {
      const newToken = JWT.generate(
        {
          _id: payload._id,
          username: payload.username
        },
        '10h'
      )
      res.header('Authorization', newToken)
      next()
    } else {
      //过期就返回401
      res.status(401).send({ errCode: '-1', errorInfo: 'token过期' })
    }
  }
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log(err)
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
