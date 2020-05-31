const router = require("express").Router();
const activityFactory = require("./index.js");


router.post("/", async (req, res) => {
	const activityResp = await activityFactory.addActivity(req, res);
	res.send(activityResp);
});


module.exports = router;
