const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

function authController() {
    // Factory functions pattern for controllers
    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')

                }

                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')

                })
            })(req,res,next)
        },

        register(req, res) {
            res.render('auth/register');
        },

        async postRegister(req, res) {
            try {
                console.log(req.body);
                const { name, email, password } = req.body;

                // Validate request
                if (!name || !email || !password) {
                    req.flash('error', 'All fields are required');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Check if email already exists
                const emailExists = await User.exists({ email: email });
                if (emailExists) {
                    req.flash('error', 'Email is already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword
                });

                console.log("hello");

                // Save user
                await user.save();

                // Redirect after successful registration
                return res.redirect('/');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },

        async logout(req, res) {
            try {
                req.logout(); // Logging out the user
                await req.session.destroy(); // Destroy the session
                return res.redirect('/login'); // Redirect to login page after logout
            } catch (error) {
                console.error(error);
                return res.redirect('/'); // Handle errors by redirecting to a suitable page
            }
        }
        



    };
}

module.exports = authController;
