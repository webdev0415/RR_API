import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { User } from "models";

const jwtAuthOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtAuthOpts, async (jwtPayload, done) => {
    const user = await User.findRecord({ id: jwtPayload.userId });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  }),
);
