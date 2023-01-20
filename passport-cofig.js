const LocalStrategy = require ("passport-local") . Strategy
const bcrypt = require('bcrypt');
const  Passport  = require("passport");

function initialize(passport, getUserByEmail, getUserById) {
    // function to autenticate users

    const authenticateUser = async (email, password, done) => {
        // get user by email
        const user = getUserByEmail(email);
        if (user == null){
            return done(null, false, {message: 'no user found with that email'})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: 'password mismatch'})
            }
        }
        catch(e) {
            console.log (e);
            return done (e);
        }
    }
    passport.use(new LocalStrategy({usernameField: "email"}, authenticateUser))
    passport.serializeUser((user, done) => {null, user.id})
    passport.deserializeUser((id, done) =>{
        return done(null, getUserById(id)); 
    })

};

module.exports = initialize;