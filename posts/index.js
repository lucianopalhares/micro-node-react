const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = [];

app.get('/posts', async (req, res) => {

    try {
        
        const r = await axios.get('http://query-clusterip-srv:4002/posts');

        if (r.data !== undefined) {
            console.log('tem dados',r)
            res.status(201).send(r.data);
        } else {
            console.log('nao tem dados')
            res.status(201).send({"posts":"undefined"});
        }
    
    } catch (error) {
        console.log('um erro ocorreu', error)
        res.status(201).send({"posts":"error"});
        
    }
    
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    console.log('req chegando', req)
    console.log('body chegando', req.body)
    console.log('title do bod', title)

    await axios.post('http://event-bus-clusterip-srv:4005/events',{
        type: 'PostCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {

    console.log('Receiving event', req.body.type);

    res.send({})
})

app.get('/event-bus', async (req, res) => {

    try {        
    
        const r = await axios.get('http://event-bus-clusterip-srv:4005/events');

        console.log('event-bus', r)
        res.status(201).send(r.data);

    } catch (error) {
        res.status(400).send({"error":error});       
    }
    
})

app.get('/prune-query', async (req, res) => {
    await axios.get('http://query-clusterip-srv:4002/prune');
})

app.listen(4000, () => {
    console.log('listening on 4000');
});

