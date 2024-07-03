var express = require('express')
const UserController = require('../../controllers/admin/UserController')
var UserRouter = express.Router()
//图片上传
const multer = require('multer')
const upload = multer({ dest: 'public/avataruploads/' })

UserRouter.post('/adminapi/user/login', UserController.login)
UserRouter.post('/adminapi/user/upload', upload.single('file'), UserController.upload) //别搞乱了upload
// UserRouter.get('/adminapi/user/home', (req, res) => {
//   res.send({ ok: 1 })
// })

module.exports = UserRouter
