let association = require('./schemas').associationModel;
let event = require('./schemas').eventModel;

let router = require('express').Router();

router.get('/', (req, res) => {
  event.find().exec((err, events) => {
    if (events) {
      res.setHeader('Content-Type', 'application/json');
      let sub = req.query.sub;
      if (sub) {
        if (!Array.isArray(sub)) sub = Array.of(sub);
        let filterEvents = events.filter(event => sub.includes(event.association))
          .filter(event => event.dateEnd > new Date());
        res.status(200).send(JSON.stringify(filterEvents));
      } else res.status(400).send();
    } else res.status(404).send();
  }).catch(error => console.error(error));
});

router.get('/associations', (req, res) => {
  association.find().exec((err, associations) => {
    if (associations) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(associations.map(association => association.name)));
    } else res.status(404).send();
  }).catch(error => console.error(error));
});

router.post('/', (req, res) => {
  if (req.body.event) {
    association.find({name: req.body.event.association, password: req.body.password}).exec((err, associations) => {
      if (associations.length) {
        let newEvent = new event(req.body.event);
        newEvent.save((err, result) => {
          res.setHeader('Content-Type', 'application/json');
          if (result) res.status(201).send(JSON.stringify(result));
          else res.status(500).send();
        });
      } else res.status(401).send();
    }).catch(error => console.error(error));
  } else res.status(400).send();
});

router.delete('/:id', (req, res) => {
  association.find({name: req.body.association, password: req.body.password}).exec((err, associations) => {
    if (associations.length) {
      event.remove({_id: req.params.id}).exec((err, removeResult) => {
        let status = removeResult.result.n ? 204 : 404;
        res.status(status).send();
      });
    } else res.status(401).send();
  }).catch(error => console.error(error));
});

module.exports = router;
