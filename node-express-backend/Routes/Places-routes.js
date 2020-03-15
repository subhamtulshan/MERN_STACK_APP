const express = require("express");
const bodyparser = require("body-parser");
const { check } = require("express-validator");

const Auth = require("../middleware/check-auth");
const route = express.Router();

const PlaceController = require("../Controllers/Places-controller");
const FileUpload = require("../middleware/fileUpload");

route.use(bodyparser.json());

route.get("/:pid", PlaceController.getPlaceByPlaceId);

route.get("/user/:uid", PlaceController.getPlaceByUserId);

route.use(Auth);

route.post(
  "/",
  FileUpload.single("image"),
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  PlaceController.createPlace
);

route.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  PlaceController.updatePlace
);

route.delete("/:pid", PlaceController.deletePlace);

module.exports = route;
