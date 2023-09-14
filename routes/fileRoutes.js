const fs = require('fs')
const Path = require('path')
const { SuccessModel, ErrorModel } = require('../ResponderModel/ResModel')

module.exports = [
    {
        method: 'POST',
        path: '/upload',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                allow: 'multipart/form-data', // 可以根据需要添加其他允许的文件类型
                maxBytes: 104857600, // 限制文件大小 (100MB)
                timeout: false, // 关闭上传超时检查
            },
            handler: async (request, h) => {
                let { files } = request.payload

                if (!files || (Array.isArray(files) && files.length === 0)) {
                    const nofile = { statusCode: 404, message: 'No files uploaded', data: null }
                    return h.response(nofile).code(400)
                }

                const fileResponses = []

                try {
                    if (!Array.isArray(files)) {
                        // 如果只上传了单个文件，将其放入数组中以进行后续处理
                        files = [files]
                    }

                    for (const file of files) {
                        // 设置保存的文件目录
                        const uploadDir = Path.join(__dirname, '../public/images')

                        // 确保目录存在，如果不存在则创建它
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true })
                        }

                        // 生成保存文件的路径，可以使用原始文件名
                        const fileName = file.hapi.filename
                        const filePath = Path.join(uploadDir, fileName)
                        // 创建可写流，将文件保存到指定路径
                        const fileStream = fs.createWriteStream(filePath)
                        file.pipe(fileStream)

                        // 使用 Promise 包装异步操作
                        await new Promise((resolve, reject) => {
                            file.on('end', () => {
                                resolve()
                            })

                            file.on('error', (err) => {
                                reject(err)
                            })
                        })

                        fileResponses.push(Path.basename(filePath))
                    }

                    // 使用成功的模型返回成功响应
					const message = fileResponses.length > 1 ? '文件列表上传成功' : '文件上传成功'
					const resinfo = new SuccessModel({ data: fileResponses, message })
                    return h.response(resinfo).code(200)
                } catch (error) {
                    console.error('File upload error:', error)
                    const errorinfo = new ErrorModel({ statusCode: 500, message: '文件上传失败' })
                    return h.response(errorinfo).code(500)
                }
            },
        },
    },
]
