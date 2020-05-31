const router = require("express").Router();
const activityFactory = require("./index.js");


router.post("/", async (req, res) => {
	const activityResp = await activityFactory.addActivity(req, res);
	res.send(activityResp);
});

router.get("/feed", async (req, res) => {
	const feedResp = await activityFactory.getFeed(req, res);
	res.send(feedResp);
});

router.get("/superlikes", async (req, res) => {
	const superLikeResp = await activityFactory.getSuperLikes(req, res);
	res.send(superLikeResp);
});






module.exports = router;
