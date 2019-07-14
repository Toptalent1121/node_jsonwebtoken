const Joi = require('joi');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}

]

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The Given ID was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secreteKey', function(err, authData) {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'yeah....',
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({user: user}, 'secreteKey', {expiresIn: '30s'}, (err, token) => {
        if(err) console.log('Err', err);
        res.json({
            token: token
        })
    })
});

app.put('/api/courses/:id', (req, res) => {
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // find the course by id, if not 404
    if(!course) return res.status(404).send('The Given ID was not found');
    
    // if invalid, return 400
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //update the course
    // return course
    course.name = req.body.name;
    res.send(courses);
});

app.delete('/api/courses/:id', (req, res) => {
    // look up the course
    // find the course by id, if not found 404
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // find the course by id, if not 404
    if(!course) return res.status(404).send('The Given ID was not found');

    //remove the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return course
    res.send(courses);
});

function validateCourse(course) {
    // validate
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}

function verifyToken(req, res, next) {
    // Get the auth header valu
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // next
        next();
    } else {
        res.sendStatus(403);
    }
}
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listening on port ${port}`)});