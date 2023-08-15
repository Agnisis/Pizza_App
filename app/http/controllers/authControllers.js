const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function authController() {
    return {
        login(req, res) {
            res.render('auth/login');
        },

        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }

                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }
                    return res.redirect('/');
                });
            })(req, res, next);
        },

        register(req, res) {
            res.render('auth/register');
        },

        async postRegister(req, res) {
            try {
                const { name, email, password } = req.body;

                if (!name || !email || !password) {
                    req.flash('error', 'All fields are required');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                const emailExists = await User.exists({ email: email });
                if (emailExists) {
                    req.flash('error', 'Email is already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword
                });

                await user.save();
                return res.redirect('/');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },

        async logout(req, res) {
            try {
                req.logout((err) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/');
                    }
                    req.session.destroy((err) => {
                        if (err) {
                            console.error(err);
                        }
                        res.redirect('/login');
                    });
                });
            } catch (error) {
                console.error(error);
                res.redirect('/');
            }
        }
        
    };
}

module.exports = authController;
