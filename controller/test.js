const Joi = require('joi')
const { ErrorModel, SuccessModel } = require('../ResponderModel/ResModel')

exports.slectTest = async (request, h) => { 

	const user = [
		{id: 1, name: 'asdas'},
		{id: 2, name: 'asdas'},
		{id: 3, name: 'asdas'},
		{id: 4, name: 'asdas'},
	]

	const info = new SuccessModel({ data: user })
	return h.response(info).code(200)
}
exports.addTest = async (request, h) => {}
exports.updateTest = async (request, h) => {}
exports.removeTest = async (request, h) => {}