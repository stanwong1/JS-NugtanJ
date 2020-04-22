const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    //random key for encryption below:
    keys:['fiefjcknfijekjfkjdf']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
        Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="verify password" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
});


app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy ({ email });
    if(existingUser) {
        return res.send('Email in use');
    }

    if(password !== passwordConfirmation){
        return res.send('Passwords must match');
    }

    //create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    //store the id of that user inside the users cookie
    //req.session added by cookie session 
    req.session.userId = user.id;

    res.send('Account Created!')

})
app.get('/signout', (req, res) => {
    //removes the cookie
    req.session = null;
    res.send('You are logged out')
});

app.get('/signin', (req,res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `)
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    //check to see if existing user
    const user = await usersRepo.getOneBy({ email });

    if(!user) {
        return res.send('Email not found');
    }
    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );

    if(!validPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id
    
    res.send('You are signed in');
})

app.listen(3000, () => {
    console.log('Listening...');
});  
