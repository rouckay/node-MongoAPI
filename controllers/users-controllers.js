const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Users = require('../models/users');
// Create new User
const signup = async (req, resp, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {

  //   const error = new HttpError('Invalid inputs passed, please check your data.', 422);

  // }
  const { name, user_name, email, password, authority } = req.body;

  // let see Existing users
  let existentUser;
  try {
    existentUser = await Users.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup Failed please Try Again Liter!", 500);
    return next(error);
  }

  if (existentUser) {
    const error = new HttpError("The Email is already Exists!", 422);
    return next(error)
  }

  const addUser = new Users({ name, user_name, email, password, authority, avatar: 'https://images.unsplash.com/photo-1689613188558-80e320f0aab9?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzODQwMjd8MHwxfGFsbHw1fHx8fHx8Mnx8MTY5MDAzOTEyNHw&ixlib=rb-4.0.3&q=85', posts: [] })

  try {
    await addUser.save();
  } catch (err) {
    const error = new HttpError("Something Went wrong Could not add user! ", 500);
    return next(error)
  }
  resp.json({ addUser })
}
const getUserByID = async (req, resp, next) => {
  const userID = req.params.id;
  let userFound;
  try {
    userFound = await Users.findById(userID)
  } catch (erro) {
    const error = new HttpError("Something Went Wrong Could Not Fetch Single User", 404);
  }

  if (!userFound) {
    const error = new HttpError("Could Not Find Content with accroding this ID!", 404);
  }
  resp.json({ Users: userFound.toObject({ getters: true }) });

}
// const DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Max Schwarz',
//     email: 'test@test.com',
//     password: 'testers'
//   }
// ];
// Get All Users Here
const getUsers = async (req, res, next) => {

  let users;
  try {
    users = await Users.find({}, '-password');
  } catch (err) {
    const error = new HttpError("Could not List the Users! ", 404);
    return next(error);
  }

  res.json({ Users: users.map(us => us.toObject({ getters: true })) })

};

// const signup = (req, res, next) => {

//   const { name, email, password } = req.body;

//   const hasUser = DUMMY_USERS.find(u => u.email === email);
//   if (hasUser) {
//     throw new HttpError('Could not create user, email already exists.', 422);
//   }

//   const createdUser = {
//     id: uuid(),
//     name, // name: name
//     email,
//     password
//   };

//   DUMMY_USERS.push(createdUser);

//   res.status(201).json({ user: createdUser });
// };

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let registereduser;
  try {
    registereduser = await Users.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not Login try Agian later! ", 500);
    return next(error);
  }

  if (!registereduser || registereduser.password != password) {
    const error = new HttpError("Invalid Credintials Please Try agian Later! ", 401)
    return next(error);
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserByID = getUserByID;
// exports.createNewUser = createNewUser;
