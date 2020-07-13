const handleRegister = (req,res,db,bcrypt)=> {
	const {email, name, password } = req.body;
	if(!email || !name || !password){
		return res.status(400).json('Enter all the fields');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx =>{
			return trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
					.then(user =>{
						res.json(user[0]); //only 1 user can be present
					})
					
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register'))
			
		//to get last user info
		// res.json(database.users[database.users.length-1]);

}

module.exports = {
	handleRegister: handleRegister
}