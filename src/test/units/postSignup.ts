import { RequestHandler } from 'express';
import { User } from 'src/models/user';
import bcrypt from 'bcrypt';

export const postSignupPage: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.status(302)
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        favorites: [],
      });
      user.save()
      return res.status(302).redirect('/logout')
    }
  } catch (err: any) {
    next(err);
    return err;
  }
};
