const express = require("express"); 
const router = express(); 

// routers controler 
router.use("/api/users", require("./UserRoutes"));
router.use("/api/accounts", require("./AccountRoutes"));
router.use("/api/transition", require("./TransitionRoutes"));

// rotes test
router.get("/", (req, res) => {
   res.send("API Working!");
})

module.exports = router