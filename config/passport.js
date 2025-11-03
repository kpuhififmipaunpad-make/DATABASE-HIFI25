const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const User = require("../app/users/model");

const compareAsync = promisify(bcrypt.compare);

module.exports = function (passport) {
  // Strategy login pakai username
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (uname, password, done) => {
        try {
          const user = await User.findOne({ username: uname });
          if (!user) {
            return done(null, false, { message: "Username tidak ditemukan" });
          }

          const isMatch = await compareAsync(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Kata sandi salah!" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Simpan id user ke session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Ambil user dari id (FIX Mongoose v7: tanpa callback)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // atau .exec()
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
