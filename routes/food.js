const router = require("express").Router();

//Require Food Schema
const Food = require("../models/Food");

// @type          ::    GET
// @route         ::    /api/foods
// @desc          ::    Route to FETCH all food details
// @access        ::    PUBLIC
router.get("/foods", (req, res) => {
  Food.find()
    .then(foods => {
      res.json({ data: foods });
    })
    .catch(err => `Network Error in fetching all food details. -- ${err} `);
});

// @type          ::    POST
// @route         ::    /api/create
// @desc          ::    Route to CREATE food items and details
// @access        ::    PUBLIC
router.post("/create", (req, res) => {
  //Creating instance of Food Model
  const newFood = new Food({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description
  });
  //---- Entry to DB ----//
  newFood
    .save()
    .then(food => {
      if (!food) {
        return res.json({ error: "Food not found" });
      }
      res.json(food);
    })
    .catch(err => `Network error in saving food to DB -- ${err}`);
});

// @type          ::    POST
// @route         ::    /api/update/:id
// @desc          ::    Route to UPDATE food details using ID
// @access        ::    PUBLIC
router.post("/update/:id", (req, res) => {
  let updateItems = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description
  };

  Food.findOne({ _id: req.params.id })
    .then(food => {
      if (!food) {
        return res.json({
          error: `No food Item to edit/update with name ${req.body.name}`
        });
      }
      Food.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateItems },
        { new: true }
      )
        .then(food => {
          res.json(food);
        })
        .catch(err => `Network error in edit/update food item. -- ${err}`);
    })
    .catch(err => `Network error in finding the food -- ${err}`);
});

// @type          ::    DELETE
// @route         ::    /api/delete/:id
// @desc          ::    Route to DELETE food details using ID
// @access        ::    PUBLIC
router.delete("/delete/:id", (req, res) => {
  Food.findOne({ _id: req.params.id })
    .then(food => {
      if (!food) {
        return res.json({ error: "No detail found to delete" });
      }
      Food.findOneAndDelete({ _id: req.params.id })
        .then(() => {
          res.json({ delete_message: "Food details successfully deleted" });
        })
        .catch(err => `Network Error in deleting food details. -- ${err}`);
    })
    .catch(err => `Network error in finding details to delete. -- ${err}`);
});

module.exports = router;
