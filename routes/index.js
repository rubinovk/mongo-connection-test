var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const schema = mongoose.Schema({ name: String })
const { DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env

/* GET home page. */
router.get('/', async function (req, res, next) {
  let saved = 'unsaved'
  try {
    console.log("GET /")

    await mongoose.connect(`mongodb://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/test?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', function (err) {
      console.log('Mongoose Connection error', err)
    });
    let status = mongoose.STATES[mongoose.connection.readyState]
    console.log('Connection state: ', status)

    const Cat = mongoose.model('Cat', schema)
    const kitty = new Cat({ name: 'Zildjian' });
    console.log('Create new object', kitty)
    await kitty.save()
    saved = await Cat.find({})
    console.log('Find saved objects', saved)
    res.render('index', { title: 'Mongo connection test', status, content: JSON.stringify(saved) });
  } catch (err) {
    console.error(err)
    next(err)
  }
});

module.exports = router;
