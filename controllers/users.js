const User = require("../models/user");

module.exports.renderSignup = async (req,res)=>{
    res.render("users/signup");
};


module.exports.signup = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Successfully signed up");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};


module.exports.renderLogin = async (req,res)=>{
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success" ,"Welcome to Wandelust! you logged in successfully");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
    };

    

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have logged out successfully");
        return res.redirect("/listings");
    });
};

