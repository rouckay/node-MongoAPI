const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const Page_Content = require('../models/content');
const HttpError = require('../models/http-error');
const Users = require('../models/users');
const mongoose = require('mongoose');

// Get Content By ID
const getContentById = async (req, res, next) => {
  const contentId = req.params.pid; // { pid: 'p1' }
  let content;
  try {
    content = await Page_Content.findById(contentId)
  } catch (err) {
    const error = new HttpError("Sorry Could Not Found any Page Content by This ID!", 500);
    return next(error)
  }

  if (!content) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error)
  }

  res.json({ content: content.toObject({ getters: true }) }); // => { place } => { place: place }
};


const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMYCONTENT.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { page_name, title, description, author } = req.body;

  // const title = req.body.title;
  const createContent = new Page_Content({ page_name, title, description, image: 'https://images.unsplash.com/photo-1689613188558-80e320f0aab9?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzODQwMjd8MHwxfGFsbHw1fHx8fHx8Mnx8MTY5MDAzOTEyNHw&ixlib=rb-4.0.3&q=85', author })


  let user;

  try {
    user = await Users.findById(author);
  } catch (err) {
    const error = new HttpError("Could Not Insert the Content for this page! ", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could Not Find The Uers Try Agian!", 404);
    return next(error);
  }
  console.log(user)

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createContent.save({ session: sess });
    user.posts.push(createContent);
    console.log(createContent);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("There is Problem with Creatin New Content Page! ", 500);
    return next(error)
  }

  res.status(201).json({ Content: createContent });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, page_name } = req.body;

  const ContentPageId = req.params.pid;

  let updateContentPage;
  try {
    updateContentPage = await Page_Content.findById(ContentPageId);
  } catch (err) {
    const error = new HttpError("Could not update Place by This Id! ", 500);
    return next(error);
  }

  updateContentPage.title = title;
  updateContentPage.description = description;
  updateContentPage.page_name = page_name;

  try {
    await updateContentPage.save();
  } catch (err) {
    const error = new HttpError("Something went wrong could not update Content Page with this ID! ", 500);
    return next(error);
  }

  res.status(200).json({ UpdatePage: updateContentPage.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const deleteId = req.params.pid;

  let content;
  try {
    content = await Page_Content.findById(deleteId);
  } catch (err) {
    const error = new HttpError("Something Went Wrong Could not Delete Content", 500);
    return next(error);
  }

  try {
    await content.deleteOne();
  } catch (err) {
    const error = new HttpError("Could Not remove The page with Content! ", 500);
    return next(error);
  }

  res.status(200).json({ message: 'Content Deleted Successfully!.' });
};

exports.getContentById = getContentById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
