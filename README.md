Manual way to write out Body Parser

const bodyParser = (req, res, next) => {
    if (req.method === 'POST') {
    //request object "on", similar to addEventListener
        req.on('data', data => {
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split('=');
                formData[key] = value;
            }
            req.body = formData;
            next();
        });
    } else {
        next();
    }
};



Module Exports:

//how other files would look like, by adding the 'new' and ('users.json'), system will know to only follow this instance instead of a new repo
//const UsersRepository = require('./users');
//const repo = new UsersRepository('users.json');    

//if we did the new and ('users.json'), other files will look like this:
//const repo = require('./users');
//repo.getAll();
//get.getOne();
