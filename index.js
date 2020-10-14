const express = require('express')
const http = require('http');
const proxy = require('express-http-proxy')

const app = express()
const port = 30002;

app.use('/static', express.static('.'));

app.use('/:host', (req,res,next)=>{
  const host = req.params.host;
  delete req.params.host;
  proxy(`http://${host}`)(req,res,next);
})

const srvr = http.createServer(app);
srvr.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});
srvr.timeout = 1800000;