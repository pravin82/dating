const dbUtils = require(`${__base}/database/sql`);



function validateActivityData(base_userId, target_userId, activity){
	let vaildateDataResp = {}
	const validActivitis = ['LIKE', 'SUPERLIKE','BLOCK']
	vaildateDataResp.status = 'error'
	if(!base_userId){
		vaildateDataResp.msg = 'Please Login again'
	} else if(!(target_userId && activity)){
		vaildateDataResp.msg = "Pass the activity and target_userId"
	} else if(!validActivitis.includes(activity)){
		vaildateDataResp.msg = "Activity value must be LIKE or SUPERLIKE or BLOCK"
	} else {
		vaildateDataResp.status = "success"
	}
	return vaildateDataResp
}

function emitUserAction(target_userId, activity){
	if(activity == 'LIKE'){
       io.in(target_userId.toString()).emit('LIKE', {msg: 'You have got new Like'});
	} else if(activity == 'SUPERLIKE'){
       io.in(target_userId.toString()).emit('SUPERLIKE', {msg: 'You have got new Like'});
	}
}

async function addActivity(req, res) {
	let addActivityResp = {}
	const {userId:base_userId} = req.session;
	const {target_userId, activity} = req.body;
	const vaildateDataResp = validateActivityData(base_userId, target_userId, activity)
	if(vaildateDataResp.status == 'error') return vaildateDataResp
	let statement = `insert into interactions (base_user,target_user, user_activity) values ($1, $2, $3)` ;            
	let values = [base_userId, target_userId, activity];
	addActivityResp = await dbUtils.sqlExecutorAsync(req, res, statement, values);
	if(addActivityResp.status == 'success'){
		emitUserAction(target_userId, activity)
	}
	return addActivityResp;
}

async function getFeed(req, res){
	const { userId } = req.session
	let statement =  `select u.id, u.name, u.image from users u where u.id not in(
	                  select i.base_user from interactions i 
	                  where i.target_user = $1  and i.user_activity = 'BLOCK')`
	let values = [userId]
	let getFeedResp = await dbUtils.sqlExecutorAsync(req, res, statement, values);
	return getFeedResp
}

async function getSuperLikes(req, res) {
	const {userId} = req.session
	let statement = ` select u.id, u.name, u.image from users u where u.id in (
	                  select i.base_user from interactions i 
	                  where i.target_user = $1 and i.user_activity = 'SUPERLIKE)`
	let values = [userId]
	let getSuperLikesResp = await dbUtils.sqlExecutorAsync(req, res, statement, values);
	return getSuperLikesResp
}





module.exports = {
	addActivity,
	getFeed,
	getSuperLikes
}
