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
const Question = require('../../database/models/Question');
const Service = require('../../database/models/Service');
const Review = require('../../database/models/Review');

router.route('/services/:serviceId/reviews')
    .all(async (req, res, next) => {
        if (!isValidUUID(req.params.serviceId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        next();
    }).get(async (req, res) => {
        try {

            const reviews = await Review.findAll({ where: { serviceId: req.params.serviceId}});
            return res.status(200).json(reviews);

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });
        }
    }).post(
        async (req, res) => {
            try {

                const { userId, grade, title, description } = req.body;

                if(!isValidUUID(userId)){
                    return res.status(400).json({error: "id usuario inválido"});
                }

                const foundUser = await User.findOne({ where: { id: req.body.userId } });

                if(!foundUser){
                    return res.status(400).json({ error: 'usuário inválido' });
                }

                const createdReview = await Review.create({
                    title,
                    description,
                    grade,
                    serviceId: req.params.serviceId,
                    userId,
                });

                return res.status(200).json({ createdReview });

            } catch (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Server Error!" })
            }
        });

module.exports = app => app.use('/', router);
