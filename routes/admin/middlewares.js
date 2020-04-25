const { validationResult } = require('express-validator');

module.exports = {
    //using templateFunc so we can customize the middlware for different routes
    handleErrors(templateFunc, dataCb) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                //placed outside of scope so can gain access
                let data = {};
                if (dataCb) {
                    data = await dataCb(req);
                }
                return res.send(templateFunc({ errors, ...data }));
            }

            next();
        };
    },
    //no customization required, pass referece, check user.id property, if undefined, redirect
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }
        //run next if everything goes smooth         
        next();
    }
};