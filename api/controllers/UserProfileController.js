const express = require('express');
const router = express.Router();

const User = require('../../database/models/User');
const isAuthenticate = require('../middlewares/isAuthenticate');
const Profile = require('../../database/models/Profile');

const { isValidUUID, minLength, maxLength } = require('../helpers/validators');
const { max } = require('../../database/models/User');
const { body, validationResult } = require('express-validator');
const ProfileItem = require('../../database/models/ProfileItems');

router.route('/users/:userId/profiles')
    .all(async (req, res, next) => {
        if (!isValidUUID(req.params.userId)) {
            return res.status(400).json({ error: 'ID usuário inválido' });
        }
        next();
    }).get(async (req, res) => {
        try {

            const foundProfile = await Profile.findOne({ where: { userId: req.params.userId } });

            if (!foundProfile) {
                return res.status(400).json({ error: "Perfil não encontrado" });
            }

            return res.status(200).json({ foundProfile });

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });
        }
    }).post(
        body('biography').isLength({ max: 200 }),
        body('othersInfo').isLength({ max: 200 }),
        body('items').isArray(),
        async (req, res) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const { userId } = req.params;

                const { biografy, items, otherInfo } = req.body;

                const user = await User.findOne({ where: { id: req.params.id } });

                if (!user) {
                    return res.status(400).json({ error: "Usuário não encontrado" });
                }

                const createdProfile = await Profile.upsert({
                    biografy,
                    items,
                    otherInfo,
                }, {
                    where: { userId }, include: [{
                        association: ProfileItem,
                        as: 'items',
                    }]
                });

                return res.status(200).json({ createdProfile });

            } catch (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Server Error!" })
            }
        });

module.exports = app => app.use('/', router);
