const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );

  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'http://localhost:9000',
  //     changeOrigin: true,
  //   })
  // ); 

  // app.use(
  //   '/durgesh077-faas-c11w3ys56r3',
  //   createProxyMiddleware({
  //     target: 'http://localhost:9000',
  //     changeOrigin: true,
  //   })
  // ); 
};