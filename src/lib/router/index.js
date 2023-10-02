const { NotFoundError } = require("../../utils/error");

class Router {
    constructor() {
        this.routeMap = {};
    }

    routes(options) {
        const { prefix } = options;
        const router = new Router();
        Object.keys(this.routeMap).forEach((route) => {
            const routeInfo = this.routeMap[route];
            Object.keys(routeInfo).forEach((method) => {
                const { path, handler } = routeInfo[method];
                router.addRoute(method, `${prefix}${path}`, handler);
            });
        });
        return router.middleware();
    }

    addRoute(method, path, handler) {
        path = path.replace(/\/$/g, '');
        const segments = path.split('/');
        const keys = [];
        const regexSegments = segments.map((segment) => {
            if (segment.startsWith(':')) {
                keys.push(segment.substr(1));
                return '([^/]+)';
            }
            return segment;
        });
        const regexPath = `^${regexSegments.join('\\/')}$`;

        let route = this.routeMap[`${path}`] || {};
        route[method] = {
            path,
            keys,
            handler,
            regex: new RegExp(regexPath),
        };
        this.routeMap[`${path}`] = route;
        return this;
    }

    matchRoute(method, path) {
        for (const routePath of Object.keys(this.routeMap)) {
            const route = this.routeMap[routePath][method];
            if (route) {
                const match = path.match(route.regex);
                if (match) {
                    const params = {};
                    route.keys.forEach((key, index) => {
                        params[key] = match[index + 1];
                    });
                    return {
                        handler: route.handler,
                        params
                    };
                }
            }
        }
        return null;
    }

    get(path, handler) {
        return this.addRoute('GET', path, handler);
    }

    post(path, handler) {
        return this.addRoute('POST', path, handler);
    }

    delete(path, handler) {
        return this.addRoute('DELETE', path, handler);
    }

    middleware() {
        return (req, res, next) => {
            try {
                const { method, url } = req;
                const routeInfo = this.matchRoute(method, url);

                if (!routeInfo) {
                    next(new NotFoundError());
                    return;
                }

                const { handler, params } = routeInfo;
                const body = [];
                req.on('data', (chunk) => {
                    body.push(chunk);
                });
                req.on('end', () => {
                    try {
                        const jsonBody = Buffer.concat(body).toString();
                        const resp = {
                            statusCode: 200,
                            body: null,
                        };
                        handler({
                            body: jsonBody ? JSON.parse(jsonBody) : {},
                            params,
                        }, resp);

                        res.statusCode = resp.statusCode;
                        res.end(JSON.stringify(resp.body));
                        next();
                    } catch (error) {
                        next(error);
                    }
                });
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = Router;
