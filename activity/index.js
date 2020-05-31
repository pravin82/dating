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



module.exports = {
	addActivity
}
