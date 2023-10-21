const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    page_name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose.Types.ObjectId, ref: 'Users' }
})
module.exports = mongoose.model("Page_Content", ContentSchema)