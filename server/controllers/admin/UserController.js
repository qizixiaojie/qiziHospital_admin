const UserService = require('../../services/admin/UserService.js')
const JWT = require('../../util/JWT.js')

const UserController = {
  login: async (req, res) => {
    var result = await UserService.login(req.body)
    if (result.length === 0) {
      res.send({
        code: '-1',
        error: '用户密码不匹配'
      })
    } else {
      console.log(result[0]._id.toString())
      //生成token
      const token = JWT.generate(
        {
          _id: result[0]._id.toString(),
          username: result[0].username
        },
        '10h'
      )
      res.header('Authorization', token)
      res.send({
        ActionType: 'OK',
        data: {
          username: result[0].username,
          gender: result[0].gender ? result[0].gender : 0, //性别，0，1,2
          introduction: result[0].introduction, //简介
          avatar: result[0].avatar,
          role: result[0].role //管理员1，
        }
      })
    }
  },
  upload: async (req, res) => {
    // console.log(req.body, req.file)
    const { username, introduction, gender } = req.body
    const avatar = req.file ? `/avataruploads/${req.file.filename}` : ''
    const token = req.headers['authorization'].split(' ')[1]

    var payload = JWT.verify(token)
    // console.log(payload._id, '~~~~~~~~~~~~~~~~~')
    await UserService.upload({ _id: payload._id, username, introduction, gender: Number(gender), avatar })
    // console.log(payload._id, username, introduction, gender, avatar),
    if (avatar) {
      res.send({
        ActionType: 'OK',
        data: {
          username,
          introduction,
          gender: Number(gender),
          avatar
        }
      })
    } else {
      res.send({
        ActionType: 'OK',
        data: {
          username,
          introduction, //这里教程没写
          gender: Number(gender)
        }
      })
    }
  }
}

module.exports = UserController
