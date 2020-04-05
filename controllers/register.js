const handleRegister = (req, res, db, bcrypt) => {

    const { email, name, password } = req.body;

    if(!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    
    const hash = bcrypt.hashSync(password,10);
    db.transaction(trx => {
        trx('login').insert({
            hash: hash,
            email: email
        })
        .then(() => {
            return trx('login').where('email', email).then(em => {
                return em[0].email;
            });
        })
        .then(loginEmail => {
            return trx('users')
                .insert({
                    email: loginEmail,
                    name: name,
                    joined: new Date()
                })
                .then(() => {
                    trx('users').where('email', email).then(user => {
                        res.json(user[0]);
                    });
                })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};