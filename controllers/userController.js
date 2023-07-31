const fs = require('fs');
const argon2 = require('argon2')

const usersData = fs.readFileSync(`${__dirname}/../users.json`)
const users = JSON.parse(usersData);

exports.getUsers = (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Success",
        length: users.length,
        data: users
    })
}
exports.addUsers = async (req, res) => {
    const newId = users.length + 1;
    const hashedPass = await argon2.hash("req.body.password")
    const newUser = Object.assign(req.body, { id: newId, password: hashedPass });
    users.push(newUser);
    console.log(users, users.length)
    fs.writeFileSync('./users.json',
        JSON.stringify(users), (error) => {
            if (error) {
                res.status(300).json({ message: "An Error Occured" })
            } else {
                res.status(201).json({ message: "success" })
            }
        }
    )
    res.status(201).json({ message: "success" })
}
exports.siginIn = async (req, res) => {
    let userExits = users.find(user => {
        if (user.email === req.body.email) {
            return user;
        }
    })
    if (userExits) {
        const pass = await argon2.verify(userExits.password, req.body.password)
        if (pass) {
            return userExits;
        }
    }
    console.log(userExits, 'jjj')
    res.status(200).json(userExits)
}
exports.editUser = (req, res) => {
    let filter = users.find(user => {
        if (user.id == req.params.id) {
            return user
        }
    })

    if (filter) {
        // users.forEach(x =>{
        //     if(filter.id == x.id){
        //         console.log('ss')
        //         x = {...x, name: req.body.name || x.name, email: req.body.email || x.email}
        //     }
        // }) 

        let updatedUsers = users.map(x => {
            if(filter.id == x.id){
                var returnValue = { ...x, name: req.body.name || x.name, email: req.body.email || x.email};
                return returnValue
            }else{
                return x
            }
        })
        console.log(updatedUsers)

        fs.writeFileSync('./users.json',
        JSON.stringify(updatedUsers))
        res.status(200).json({ "message": "successfully edited" })
    } else {
        res.status(404).json({ "message": "user not found" })
    }
}
exports.deleteUsers = (req, res) => {
    let filter = users.find(user => {
        if (user.id == req.params.id) {
            return user
        }
    })
    if (filter) {
        var deleteUser = users.findIndex((deleteuser) => deleteuser.id === filter.id);
        users.splice(deleteUser, 1);
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        res.status(200).json({ "message": "successfully deleted" })
    } else {
        res.status(404).json({ "message": "user not found" })
    }
}