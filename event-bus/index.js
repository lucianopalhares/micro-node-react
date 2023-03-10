const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://posts-clusterip-srv:4000/events', event);//nao faz nada
    axios.post('http://comments-clusterip-srv:4001/events', event);//comments
    axios.post('http://query-clusterip-srv:4002/events', event);//grava
    axios.post('http://moderation-clusterip-srv:4003/events', event);//moderation

    res.send({status:'OK'});
});

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log('event bus Listening on 4005')
});

