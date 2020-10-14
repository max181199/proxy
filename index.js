const express = require('express')
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authFilter = require('./middlewares/auth-filter');
const proxy = require('express-http-proxy')

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express()
const port = 30002;

app.use(bodyParser.json());
app.use(cookieParser());

if(process.env.NODE_ENV == 'production') {
  authFilter(app);
}

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