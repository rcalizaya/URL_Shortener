require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls=[];
const shortUrls = [];
app.post('/api/shorturl', function(req, res) {
  //res.json({ submit: req.body.url });
  const url = req.body.url;
  const foundIndex= originalUrls.indexOf(url);
  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({error: 'Invalid url'})
  }

  if(foundIndex<0){
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    return res.json({
      original_url: url,
      short_url: shortUrls.length-1
    });
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  });

});

app.get('/api/shorturl/:shorturl',(req,res)=>{
  const shorturl1= parseInt(req.params.shorturl);
  const foundInd= shortUrls.indexOf(shorturl1);
  if(foundInd<0){
    return res.json({
      error: 'No short URL found for the given input'
    });
  }
  res.redirect(originalUrls[foundInd]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
