import express from 'express';
import http from 'http';
import path from 'path';


const app = express();
const server = http.Server(app);


app.use('/app.js', express.static(
  path.resolve(__dirname, '../', 'client/app.js')
));

app.use('/styles.css', express.static(
  path.resolve(__dirname, '../', 'client/styles.css')
));

app.get(['/', '/*'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client/index.html'));
});

export default server;
