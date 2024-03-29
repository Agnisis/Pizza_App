const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/orders" : "/customer/orders";
  };
  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash("error", "Enter email and password");
        return res.redirect("/login");
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          req.flash("error", "All fields are required");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }

        const emailExists = await User.exists({ email: email });
        if (emailExists) {
          req.flash("error", "Email is already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });

        await user.save();
        return res.redirect("/");
      } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        return res.redirect("/register");
      }
    },

    async logout(req, res) {
      try {
        req.logout((err) => {
          if (err) {
            console.error(err);
            return res.redirect("/");
          }
          req.session.destroy((err) => {
            if (err) {
              console.error(err);
            }
            res.redirect("/login");
          });
        });
      } catch (error) {
        console.error(error);
        res.redirect("/");
      }
    },
  };
}

module.exports = authController;



// const User = require("../../models/user");
// const bcrypt = require("bcrypt");
// const passport = require("passport");

// function authController() {
//   const getRedirectUrl = (req) => {
//     return req.user.role === "admin" ? "/admin/orders" : "/customer/orders";
//   };

//   return {
//     login(req, res) {
//       res.render("auth/login");
//     },

//     async postLogin(req, res, next) {
//       passport.authenticate("local", (err, user, info) => {
//         if (err || !user) {
//           req.flash("error", info.message || "Invalid credentials");
//           return res.redirect("/login");
//         }

//         req.logIn(user, (err) => {
//           if (err) {
//             req.flash("error", "An error occurred during login");
//             return next(err);
//           }

//           return res.redirect(getRedirectUrl(req));
//         });
//       })(req, res, next);
//     },

//     register(req, res) {
//       res.render("auth/register");
//     },

//     async postRegister(req, res) {
//       const { name, email, password } = req.body;

//       if (!name || !email || !password) {
//         req.flash("error", "All fields are required");
//         return res.redirect("/register");
//       }

//       try {
//         const emailExists = await User.exists({ email: email });
//         if (emailExists) {
//           req.flash("error", "Email is already taken");
//           return res.redirect("/register");
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//           name: name,
//           email: email,
//           password: hashedPassword,
//         });

//         await user.save();
//         return res.redirect("/");
//       } catch (error) {
//         console.error(error);
//         req.flash("error", "Something went wrong");
//         return res.redirect("/register");
//       }
//     },

//     logout(req, res) {
//       req.logout(); // Logout the user
//       req.session.destroy((err) => {
//         if (err) {
//           console.error(err);
//         }
//         res.redirect("/login");
//       });
//     },
//   };
// }

// module.exports = authController;
