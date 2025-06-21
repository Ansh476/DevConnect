const express = require("express");
const passport = require("passport");
const googleRouter = express.Router();

googleRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

googleRouter.get("/googleauth", passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            const token = await req.user.getJWT();
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
        } catch (err) {
            console.error(err);
            res.redirect("http://localhost:5173/login?error=google_auth_failed");
        }
    }
);

module.exports = googleRouter;
