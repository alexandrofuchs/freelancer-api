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

router.route('/services/:serviceId/questions')
    .all(async (req, res, next) => {
        if (!isValidUUID(req.params.serviceId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        next();
    }).get(async (req, res) => {
        try {

            const questions = await Question.findAll();
            return res.status(200).json({ questions });

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Server Error!" });
        }
    }).post(
        async (req, res) => {
            try {

                const { question, questionId } = req.body;

                if(!question){
                    return res.status(400).json({ error: 'pergunta inválida! '})
                }

                if (!isValidUUID(req.body.userId)) {
                    return res.status(400).json({ error: 'ID usuário inválido' });
                }

                if ( !await Service.findOne({ where: { id: req.params.serviceId } })){
                    return res.status(400).json({ error: 'id serviço inválido' });
                }

                const foundUser = await User.findOne({ where: { id: req.body.userId } });

                if(!foundUser){
                    return res.status(400).json({ error: 'usuário inválido' });
                }

                const createdQuestion = await Question.create({
                    question,
                    serviceId: req.params.serviceId,
                    userName: `${foundUser.firstName} ${foundUser.lastName}`,
                    userId: req.body.userId,
                });

                return res.status(200).json(createdQuestion);

            } catch (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Server Error!" })
            }
        });

module.exports = app => app.use('/', router);
