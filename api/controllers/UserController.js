const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const isAuthenticate = require('../middlewares/isAuthenticate');
//const isValidID = require('../middlewares/isValidId');
//const { createOrUpdate, findById, findAll, remove, authenticate, updatePassword } = require('../services/UserService');
const router = express.Router();

//const isAdmin = require('../middlewares/isAdmin');
const User = require('../../database/models/User');

router.post('/authenticate',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            let foundUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }]
                }
            });

            if (!foundUser) {
                return res.status(400).json({ error: "Credênciais inválidas!" });
            }

            if (password !== foundUser.password) {
                return res.status(400).json({ message: "Credênciais inválidas!", data: null });
            }

            // if (!await bcrypt.compare(password, foundUser.password)) {
            //     return res.status(400).json({ message: "Credênciais inválidas!", data: null });
            // }

            let token = await jwt.sign({
                id: foundUser.id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
            }, process.env.ENCRYPT_KEY_TOKEN, {
                expiresIn: 60 * 60 * 60
            })

            return res.status(200).json({ data: token });

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server Error!" });
        }
    });
//router.get('/validate', isAuthenticate, async (req, res) => await res.status(200).json(true));

router.post('/', async (req, res) => {
    const createUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    return res.status(201).json({ createUser })
});

router.get('/', async (req, res) => {
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