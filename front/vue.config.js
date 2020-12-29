module.export = {
    devServer: {
        proxy: {
            '^/api': {
                target: `http://localhost:${process.env.RED_API_PORT}`,
                ws: true,
                pathRewrite: { '^/api': '' },
            }
        }
    }
}