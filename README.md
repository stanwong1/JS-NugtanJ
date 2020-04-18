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