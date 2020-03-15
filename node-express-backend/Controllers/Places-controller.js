const uuid = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const HttpsError = require("../Models/https-error");
const Place = require("../Models/Place");
const User = require("../Models/User");
const FileUpload = require("../middleware/fileUpload");

const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpsError("something went wrong", 5000));
  }
  if (!place) {
    const error = new HttpsError(
      "cannot find the place with given placeid",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let place;
  try {
    place = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }
  // const place = DUMMY_PLACES.filter(p => p.creator === userId);
  if (!place || place.length == 0) {
    const error = new HttpsError(
      "cannot find the place with given userid",
      404
    );
    return next(error);
  }
  res.json({ place: place.map(p => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new HttpsError("Inputs are not valid", 422));
  }
  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title: title,
    description: description,
    location: { lat: 22, lng: 23 },
    address: address,
    creator: creator,
    image: req.file.path
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpsError("something went wrong check", 500));
  }

  if (!user) {
    return next(new HttpsError("cannot find the user with the given id", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpsError("cannot create the place", 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    console.log(err);
    throw new HttpsError("Inputs are not valid", 422);
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  try {
    await Place.findByIdAndUpdate(
      placeId,
      {
        title,
        description
      },
      (err, post) => {
        // console.log(err);
        if (err) return next(new HttpsError("cannot update the place", 500));
      }
    );
  } catch (err) {
    console.log(err);
  }

  // const place = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  // if (!place) {
  //   const error = new HttpsError(
  //     "cannot find the place with given userid",
  //     404
  //   );
  //   return next(error);
  // }
  // place.title = title;
  // place.description = description;
  // DUMMY_PLACES[placeIndex] = place;
  res.status(203).json({ Place });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpsError("something went wrong", 500));
  }
  console.log(place.creator);
  console.log(req.userdata.userId);
  if (place.creator._id.toString() !== req.userdata.userId) {
    return next(new HttpsError("something went wrong not your place", 401));
  }
  // here we have used session as we want that both the operation should complete
  //together else they should not
  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch {
    return next(new HttpsError("something went wrong", 500));
  }
  fs.unlink(imagePath, err => {
    console.log(err);
  });
  res.status(200).json({ message: "place deleted" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
