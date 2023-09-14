class BaseModel {
    constructor({ data, message, statusCode }) {
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
        if (statusCode) {
            this.statusCode = statusCode
        }
    }
}

class SuccessModel extends BaseModel {
    constructor({ data = null, statusCode = 200, message = 'success', ...options }) {
        super({
            message,
            statusCode,
            data,
        })
        Object.assign(this, options)
    }
}

class ErrorModel extends BaseModel {
    constructor({ statusCode, message = 'error' }) {
        super({
            statusCode,
            message,
            data: null,
        })
    }
}

module.exports = {
    SuccessModel,
    ErrorModel,
}
