const express = require('express');
const router = express.Router();

const User = require('../../database/models/User');
const isAuthenticate = require('../middlewares/isAuthenticate');
const Profile = require('../../database/models/Profile');

const { isValidUUID, minLength, maxLength, isWord } = require('../helpers/validators');
const { max } = require('../../database/models/User');
const { body, validationResult } = require('express-validator');
const ProfileItem = require('../../database/models/ProfileItem');
const { isArray } = require('lodash');

router.route('/users/:userId/profiles')
    .all(async (req, res, next) => {
        if (!isValidUUID(req.params.userId)) {
            return res.status(400).json({ error: 'ID usuário inválido' });
        }
        next();
    }).get(async (req, res) => {
        try {

            console.log(req.params)

            const foundProfile = await Profile.findOne({ where: { userId: req.params.userId }, include: [{association:'items'}] });

            if (!foundProfile) {
                return res.status(400).json({ error: "Perfil não encontrado" });
            }

            return res.status(200).json(foundProfile);

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });
        }
    }).post(
        body('biography').isLength({ max: 200 }),
        body('othersInfo').isLength({ max: 200 }),
        
        async (req, res) => {
            try {

                const errors = validationResult(req);

                const { biography, items, otherInfo } = req.body;

                const { userId } = req.params;
                console.log(userId);

                console.log(items);

                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const user = await User.findOne({ where: { id: req.params.userId }, include:[{association:'profile'}]});

                if(!user){
                    return res.status(400).json({ error: "usuário inválido" });
                }

                await Profile.update({ biography, otherInfo }, {where: {id: user.profile.id}});

                isArray(items) ? items.map( async (item) => {
                    await ProfileItem.findOrCreate({
                        where: { title: item.title, description: item.description, profileId: user.profile.id }
                    })
                }): null;
                
                const upserted = await Profile.findOne({where: { id: user.profile.id }, include: [{association:'items'}] });



                return res.status(200).json(upserted);

            } catch (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Server Error!" })
            }
        });

module.exports = app => app.use('/', router);
