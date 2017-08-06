let mongoose = require('mongoose');
let express = require('express');
let bodyParser = require('body-parser');
let eventRouter = require('./eventRoutes');
let association = require('./schemas').associationModel;
let associations = require('./associations.json');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/database', {useMongoClient: true});
mongoose.connection.once('open', () => {
  console.log('Connected to database');
  association.on('index', error => {
    if (error) console.log(error);
    association.find().then(associationsInBase => {
      associations.filter(a => !associationsInBase.map(a => a.name).includes(a.name))
        .forEach(a => new association(a).save()
          .then(a => console.log('Saved : ', a.name))
          .catch(error => console.log(error.message)));
    }).catch(error => console.error(error));
  });
  app.use('/events', eventRouter);
  app.listen(process.env.PORT || 3000, () => console.log('Server running at http://localhost:3000'));
});
