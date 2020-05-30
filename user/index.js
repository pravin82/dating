const dbUtils = require(`${__base}/database/mysql`);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const jwtExpirySeconds = 86400;


function checkFields(email, password){
	let checkFieldsResp = {};
	if(!(email && password)) {
      checkFieldsResp.status = 'error';
      checkFieldsResp.msg = "Please pass the email and password";
	} else {
		checkFieldsResp.status = 'success';
	}
     return checkFieldsResp;
}

function generateToken(email, userId){
	const token = jwt.sign({ email, userId}, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	return token	
}

async function registerUser(req, res) {
	const {email, password} = req.body;
	const checkFieldsResp = checkFields(email, password)
	if(checkFieldsResp.status == 'error') return checkFieldsResp
	const salt = await bcrypt.genSalt(saltRounds);
	const encryptedPassword = await bcrypt.hash(password, salt);
	let statement = `insert into users (email, password) values (?, ?)` ;            
	let values = [email, encryptedPassword];
	let registerUserResp = await dbUtils.sqlExecutorAsync(req, res, statement, values);
	return registerUserResp;
}

async function loginUser(req, res) {
	const {email, password} = req.body;
	const checkFieldsResp = checkFields(email, password)
	if(checkFieldsResp.status == 'error') return checkFieldsResp
	let statement = `select id, email, password from users where email = ?`
    let values = [email]
    let loginUserResp = await dbUtils.sqlExecutorAsync(req, res, statement, values)
    if(loginUserResp.status == 'error') return loginUserResp
    console.log("loginUserResp+++++++", loginUserResp.data)
    if(loginUserResp.data.length > 0){
    	let isMatch = await bcrypt.compare(password, loginUserResp.data[0].password)
    	if(isMatch){
    		loginUserResp.status = "success"
    		loginUserResp.msg = "Login Successfull"
    		loginUserResp.token = generateToken(email, loginUserResp.data.id)
    		return loginUserResp
    	} else {
    		loginUserResp.status = 'error'
    		loginUserResp.msg = "password and email does not match"
    		return loginUserResp
    	}

    } else {
    	loginUserResp.status = 'error'
    	loginUserResp.msg = "User is not registered"
    	return loginUserResp
    }
    return loginUserResp
}




module.exports = {
	loginUser,
	registerUser
}