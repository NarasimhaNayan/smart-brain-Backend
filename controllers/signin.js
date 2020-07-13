const handleSignin = (req,res,db,bcrypt)=> {
	const { email, password } = req.body;
	if(!email || !password){
		return res.status(400).json('Enter all the fields');
	}
	db.select('email', 'hash').from('login')
	.where('email', '=', email)
		.then(data => {
			const valid = bcrypt.compareSync(password, data[0].hash);
			if(valid) {
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to login'))
			} else {
				res.status(400).json('Wrong creds')
			}
		})
		.catch(err => res.status(400).json('Wrong creds'))
}

module.exports = {
	handleSignin: handleSignin
}