const express = require('express');
//const isAuthenticate = require('../middlewares/isAuthenticate');
//const isValidID = require('../middlewares/isValidId');
//const { createOrUpdate, findById, findAll, remove, authenticate, updatePassword } = require('../services/UserService');
const router = express.Router();

//const isAdmin = require('../middlewares/isAdmin');
const User = require('../../database/models/User');

//router.post('/authenticate', authenticate);
//router.get('/validate', isAuthenticate, async (req, res) => await res.status(200).json(true));

router.post('/', async (req,res) => {
    const createUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    return res.status(201).json({ createUser })   
});

router.get('/', async (req, res) =>{
    const foundUsers = await User.findAll();
    return res.status(200).json({ foundUsers }); 
});

//router.put('/:id/password', isValidID, updatePassword);

// router.route('/:id')
//     .all(isValidID, isAuthenticate)
//     .get(findById)
//     .put(createOrUpdate)
//     .delete(remove);

module.exports = app => app.use('/users', router);