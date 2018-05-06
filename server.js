const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Bing = require('node-bing-api')({accKey:'2fca72267f8449b196a70723df65cabd'});
const SearchTerm = require('./models/searchTerm');

app.use(bodyParser.json());
app.use(cors());
mongoose.connect('mongodb://localhost/ImageSearch');

app.get('/api/recentsearchs', ( req, res, next ) => {
  SearchTerm.find({}, (err, data) => {
    res.json(data);
  })
});

app.get('/', (req, res, next) => {
  res.send('Ah flower?');
});

app.get('/api/imagesearch/:searchVal*', (req, res, next) => {
/*
  var { searchVal } = req.params;
  var { offset } = req.query;
*/
  var searchVal = req.params.searchVal;
  var offset = req.query.offset;

  console.log('offset:'), console.log(offset);

  if ( Boolean(offset) === false ) {
    offset = 0;
  }
  else if ( Boolean(offset) === true ) {
    offset = parseInt(offset);
  };

  console.log('searchVal:'), console.log(searchVal);
  console.log('offset(2):'), console.log(offset);

  var data = new SearchTerm({
    searchVal,
    searchDate: new Date()
  });

  data.save(err => {
    if (err ) {
      res.send('Error, Saving to datavase');
    }
  });

  var searchOffset = 1;

  if (offset) {
    if (offset === 1) {
      searchOffset = 1;
      offset = 0;
    }
    else if(offset > 1) {
      searchOffset = offset +1;
    }
  }
  console.log('searchOffset:'),console.log(searchOffset);
  console.log('offset(3):'), console.log(offset);

  Bing.images(searchVal, {

    top: (10 * searchOffset),
    skip: (1 * offset)

  }, function ( error, resp, body ) {
    var bingData = [];
      console.log('body:'),console.log(body);
      //console.log('body.value[0]:'),console.log(body.value[0]);

    for (var i = 0; i < 10; i++ ) {
      bingData.push({
        url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageDisplayUrl
      });
    }
    res.json(bingData);
  });
});

app.listen( 3000, function () {
    console.log('Listening to port 3000');
});
