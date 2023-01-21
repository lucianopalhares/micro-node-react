const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {

    if (type === 'PostCreated') {

        console.log('query - handleEvent receive',data)
        
        const { id, title} = data;

        console.log('query - handleEvent title',title)
        
        posts[id] = { id, title, comments: []};

        console.log('query - handleEvent mount posts',posts)

        
    
        if (posts[id] != undefined) {

            const now = new Date();

            const hoursAndMinutes = now.getHours() + ':' + now.getMinutes();
            console.log(hoursAndMinutes); 

            let postsId = posts[id];
            console.log('query - handleEvent mount posts[id]',postsId)
        }
    }

    if (type === 'CommentCreated') {

        const { id, content, postId, status} = data;

        const post = posts[postId];

        if (post.comments === undefined) {
            post.comments = {};
        }

        post.comments.push({id, content, status});
        posts[postId] = post;

        if (post.comments) {
            console.log('query comment created')
        }

    }
    
    if (type === 'CommentUpdated') {

        const { id, content, postId, status} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id
        })

        comment.status = status;
        comment.content = content;

        post.comments[id] = comment;
        posts[postId] = post;

        console.log(comment);
    }
}

app.get('/posts', (req, res) => {

    res.send(posts);
});

app.get('/prune', (req, res) => {

    posts = {};

    res.send(posts);
});

app.post('/events', (req, res) => {

    console.log('query - events req',req)
    console.log('query - events req.body',req.body)

    const { type, data } = req.body;

    console.log('query - events data handle',data)
 
    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002 ');

    try {

        const res  = await axios.get('http://event-bus-clusterip-srv:4005/events');
        
        for(let event of res.data) {
            console.log('processing event: ', event.type);

            handleEvent(event.type, event.data);
        }
    } catch(error) {
        console.log(error);
    }
});