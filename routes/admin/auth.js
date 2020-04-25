const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');

const router = express.Router();


router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post(
    '/signup', 
    [requireEmail, requirePassword, requirePasswordConfirmation],
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        
        if(!errors.isEmpty()) {
            return res.send(signUpTemplate({ req, errors }));
        }
        const { email, password, passwordConfirmation } = req.body;
        const user = await usersRepo.create({ email, password });

    //store the id of that user inside the users cookie
    //req.session added by cookie session 
    req.session.userId = user.id;
  
    res.send('Account Created');
    }
);

router.get('/signout', (req, res) => {
    //removes the cookie
    req.session = null;
    res.send('You are logged out')
});

router.get('/signin', (req, res) => {
    res.send(signInTemplate({}));
});

router.post('/signin', 
    [requireEmailExists, requireValidPasswordForUser], 

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.send(signInTemplate({ errors }));
        }

        const { email } = req.body;
        //check to see if existing user
        const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id

    res.send('You are signed in');
});

module.exports = router;