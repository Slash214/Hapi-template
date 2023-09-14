const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const HapiCors = require('hapi-cors')
const Version = require('@hapi/vision')
const HapiPino = require('hapi-pino')
const pinoPretty = require('pino-pretty')

// 路由
const testRoute = require('./routes/testModel')
const fileRoute = require('./routes/fileRoutes')

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
    })

    const plugins = [
        Inert,
        Version,
        {
            plugin: HapiCors,
            options: {
                origins: ['*'],
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                headers: ['Authorization'],
                maxAge: 600,
            },
        },
        {
            plugin: HapiPino,
            options: {
                prettyPrint: false, // 设置为 true
                logEvents: ['response', 'onPostStart'],
                stream: pinoPretty(),
            },
        },
    ]

    await server.register(plugins)

    server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'public',
                listing: false,
                index: true,
            },
        },
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('public/index.html')
        },
	})

	const allRoutes = [...testRoute, ...fileRoute]
	
	server.route(allRoutes)

    // 全局错误拦截
    server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
            const error = response.output.payload
            const statusCode = response.output.statusCode
            const message = response.message || 'An error occurred'

            const errorResponse = {
                statusCode,
                error: 'Internal Server Error',
                message,
			}
			
			return h.response(errorResponse).code(statusCode);
		}
		
		return h.continue;
	})
	
	// 自定义 404 路由
	server.route({
		method: '*',
		path: '/{any*}',
		handler: (request, h) => {
			const response = {
				statusCode: 404,
				error: 'Not Found',
				message: 'The requested resource was not found',
			}
			return h.response(response).code(404)
		}
	})

    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

init()
