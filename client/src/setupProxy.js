const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("Setting up proxy...");
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};