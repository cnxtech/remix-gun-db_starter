const GUN = require('gun');
const http = require('http');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const i = process.env.NODE;

const ports = {
    '0': {
        RELAY: 8080,
        NODE: 8081,
        FE: 3000
    },
    '1': {
        RELAY: 8090,
        NODE: 8091,
        FE: 3001
    }
}

if (!ports[i]) {
    throw Error('NODE must be 0 or 1')
}

// runs full relay peer (will sync all data)
// can also use to query if necessary
const relay = GUN({
    file: `data_${ports[i].RELAY}`,
    web: http.createServer().listen(ports[i].RELAY, () => console.log('GUN relay peer running on :' + ports[i].RELAY))
});

const node = express();
node.use(express.urlencoded({ extended: true }))
node.use(cors({ origin: `http://localhost:${ports[i].FE} or ${process.env.PUBLIC_URL}` }))

const users = {};

const sendMail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASSWORD
        }
    })
    await transporter.sendMail({
        to: email,
        subject: 'Login Email',
        html: `<p>Use this magic link to login: <a href="${process.env.PUBLIC_URL}/auth/login?email=${email}&token=${token}">LOGIN</a><p>`
    })
}

node.post('/auth/request-login', async (req, res) => {
    const email = req.query.email;
    const token = uuid.v4();
    users[email] = { loggedIn: false, token };
    await sendMail(email, token);
    res.end();
});

node.get('/auth/login', async (req, res) => {
    const { email, token } = req.query;
    if (users[email].token === token) {
        const loginToken = jwt.sign({ email }, '12345');
        return res.redirect(`http://localhost:${ports[i].FE}/login?token=${loginToken}`);
    } else {
        return res.status(401).end();
    }
})

node.listen(ports[i].NODE, () => console.log('Node running on :' + ports[i].NODE))
