const router = require("express").Router();
const userFactory = require("./index.js");


router.post("/register", async (req, res) => {
	const registerResp = await userFactory.registerUser(req, res);
	res.send(registerResp);
});

router.post("/login", async (req, res) => {
	const loginResp = await userFactory.loginUser(req, res);
	res.send(loginResp);
});

module.exports = router;
