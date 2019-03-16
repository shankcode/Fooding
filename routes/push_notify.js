// Requiring Modules
const router = require("express").Router();
const webpush = require("web-push");

// Web-push configuration
webpush.setGCMAPIKey(process.env.GOOGLE_API_KEY);
webpush.setVapidDetails(
  "mailto: shashank.5060@gmail.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

// Push Data
const data = {
  title: "Grab the SALE!",
  body: "35% Flat OFF on all orders.",
  icon: "../icon.png",
  requireInteraction: true
};

let subscription;

//------------------ REGISTER Push Notification ---------------//
// @type          ::    POST
// @route         ::    /push/register
// @desc          ::    route to register/subscribe push notification
// @access        ::    PUBLIC
router.post("/register", (req, res, next) => {
  subscription = req.body;
  res.sendStatus(201);
  // sendNotification can only take a string as it's second parameter
  webpush
    .sendNotification(subscription, JSON.stringify(data))
    .catch(err => console.log(err));
});

//------------------ UN-REGISTER Push Notification ---------------//
// @type          ::    DELETE
// @route         ::    /push/unregister
// @desc          ::    route to unsubscribe/un-register push notification
// @access        ::    PUBLIC
router.delete("/unregister", (req, res, next) => {
  subscription = null;
  res.sendStatus(200);
});

module.exports = router;
