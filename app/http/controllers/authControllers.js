const User = require('../../models/user')
const bcrypt = require('bcrypt')
function authController() {

    //factory functions pattern of programs
    return {
        login(req, res) {


            res.render('auth/login')

        },
        register(req, res) {

            res.render('auth/register')
        },


        async postRegister(req, res) {
            const { name, email, password } = req.body
            //validate req
            if (!name || !email || !password) {
                req.flash('error', 'All fields are requireds')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }


            // check email exists 
            User.exists({ email: email }, (err, result) => {
                 


                if (result) {
                    req.flash('error', 'Already Taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')

                }
            })

            




            //hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            //create user

            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            user.save().then((user) => {
                //redirect
                //login
                return res.redirect('/')

            }).catch(er => {
                req.flash('error', 'Something Went Wrong')
                return res.redirect('/register')


            })




        }
    }

}

module.exports = authController









