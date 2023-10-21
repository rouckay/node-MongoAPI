const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const Users = new Schema({
    name: { type: String, required: true },
    user_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    authority: { type: String, required: true },
    avatar: { type: String, required: true },
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Page_Content' }]
});
Users.plugin(uniqueValidator);
module.exports = mongoose.model("Users ", Users)