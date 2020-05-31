const dbUtils = require(`${__base}/database/sql`);
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

async function saveSession(req, res, userData) {
	req.session.email = userData.email;
	req.session.userId = userData.id;
	req.session.name = userData.name;
	req.session.save();
}

function generateToken(email, name, userId){
	const token = jwt.sign({ email, name, userId}, SECRET_KEY, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	return token	
}

async function registerUser(req, res) {
	const {email, password, name} = req.body;
	const checkFieldsResp = checkFields(email, password)
	if(checkFieldsResp.status == 'error') return checkFieldsResp
	const salt = await bcrypt.genSalt(saltRounds);
	const encryptedPassword = await bcrypt.hash(password, salt);
	let statement = `insert into users (email, password, name) values ($1, $2, $3)` ;            
	let values = [email, encryptedPassword, name];
	let registerUserResp = await dbUtils.sqlExecutorAsync(req, res, statement, values);
	return registerUserResp;
}

async function loginUser(req, res) {
	const {email, password} = req.body;
	const checkFieldsResp = checkFields(email, password)
	if(checkFieldsResp.status == 'error') return checkFieldsResp
	let statement = `select id, email, password, name from users where email = $1;`
    let values = [email]
    let loginUserResp = await dbUtils.sqlExecutorAsync(req, res, statement, values)
    if(loginUserResp.status == 'error') return loginUserResp
    const userData = loginUserResp.data.rows[0]
    let respObj = {}
    if(loginUserResp.data.rows.length > 0){
    	let isMatch = await bcrypt.compare(password, userData.password)
    	if(isMatch){
    		respObj.status = "success"
    		respObj.msg = "Login Successfull"
    		respObj.token = generateToken(email, userData.name, userData.id)
    		saveSession(req, res, userData)

    	} else {
    		respObj.status = 'error'
    		respObj.msg = "password and email does not match"
    	}

    } else {
    	respObj.status = 'error'
    	respObj.msg = "User is not registered"
    }
    return respObj
}




module.exports = {
	loginUser,
	registerUser
}