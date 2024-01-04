const jwt = require('jsonwebtoken');


module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization');
    if (!authHeader){
        const error = new Error('Unauthorized')
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1]
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'averytopsecretsecret')
    } catch(err){
        err.satusCode = 500;
        throw err;
    }

    if (!decodedToken){
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error
    }
    req.userId = decodedToken.userId
    next()
}
