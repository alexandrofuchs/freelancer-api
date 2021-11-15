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
const isAuthenticate = require('../middlewares/isAuthenticate');
const Profile = require('../../database/models/Profile');

const authenticate = async (req, res) => {
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
            return res.status(400).json({ error: "Credênciais inválidas!" });
        }

        // if (!await bcrypt.compare(password, foundUser.password)) {
        //     return res.status(400).json({ message: "Credênciais inválidas!", data: null });
        // }

        const token = await jwt.sign({
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
        }, process.env.ENCRYPT_KEY_TOKEN, {
            expiresIn: 60 * 60 * 60
        })

        return res.status(200).json({ token });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Server Error!" });
    }
};

router.post('/authenticate',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    authenticate
)

router.get('/validate', isAuthenticate, async (req, res) => {
    try {

        const foundUser = await User.findOne({ where: { id: req.user.id } });

        if (!foundUser) {
            return res.status(401).json({ error: "Unauthorized!" });
        }

        const token = await jwt.sign({
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
        }, process.env.ENCRYPT_KEY_TOKEN, {
            expiresIn: 60 * 60 * 60
        })

        return res.status(200).json({ token });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Server Error!" });
    }

});

const create = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "valores inválidos" });
        }

        if (await User.findOne({ where: { email: req.body.email } })) {
            return res.status(400).json({ error: 'Email já registrado' });
        }

        const createdUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            profile: {
                biography: '',
                otherInfo: '',                
            }            
        }, {
            include: [ { association: 'profile'} ]
        });
        createdUser.password = undefined;
        return res.status(201).json({ data: createdUser })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Server Error!" });
    }
}

router.post('/',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('firstName').isLength({ min: 3 }),
    body('lastName').isLength({ min: 3 }),
    create
);





router.get('/', async (req, res) => {
    const foundUsers = await User.findAll();
    return res.status(200).json({ foundUsers });
});

//router.put('/:id/password', isValidID, updatePassword);
router.put('/:id',

    //body('email').isEmail(),
    body('firstName').isLength({ min: 3 }).isAlpha(),
    body('lastName').isLength({ min: 3 }).isAlpha(),

    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ error: "valores inválidos" });
            }

            console.log(req.params.id)

            if (!await User.findOne({ where: { id: req.params.id } })) {
                return res.status(400).json({ error: "usuário inválido" });
            }

            const updatedUser = await User.update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }, {
                where: { id: req.params.id }
            });

            return res.status(200).json(updatedUser[0]);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });

        }
    });

router.route('/:id')
    //.all(isValidID, isAuthenticate)
    .get(async (req, res) => {
        try {
            const foundUser = await User.findOne({ where: { id: req.params.id } });
            return res.status(200).json({ data: foundUser });

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });
        }

    })
//.put(createOrUpdate)
//.delete(remove);

module.exports = app => app.use('/users', router);