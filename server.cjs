
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = 3000

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

function getLinkByRelFromLinkHeader(linkHeader, rel) {
    if (linkHeader) {
        const match = linkHeader.match(new RegExp(`<([^>]+)>; rel="${rel}"`))
        if (match) {
            return match[1]
        }
    }
    return null
}

// Returned resources will be wrapped in a body property
router.render = (req, res) => {
    if (req.method === 'GET' && req.url && !req.route.path.includes(':')) {
        const obj = {}
        const query = req._parsedUrl.search
        const resource = req.url.replace('/', '').replace(query, '')
        const headers = res.getHeaders();

        // Wrap data
        obj[resource] = res.locals.data

        // Add metadata
        if (headers?.link) {
            obj.metadata = {
                first: getLinkByRelFromLinkHeader(headers.link, 'first'),
                prev: getLinkByRelFromLinkHeader(headers.link, 'prev'),
                next: getLinkByRelFromLinkHeader(headers.link, 'next'),
                last: getLinkByRelFromLinkHeader(headers.link, 'last'),
            }
        }
        // Return wrapped response
        res.jsonp(obj)
    } else {
        res.jsonp(res.locals.data)
    }
}

// Use default router
server.use(router)
server.listen(port, () => {
    console.log(`JSON API Server is running on Port ${port}`)
})