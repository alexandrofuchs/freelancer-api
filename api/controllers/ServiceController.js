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
const isValidId = require('../middlewares/isValidId');
const Service = require('../../database/models/Service');
const { isValidUUID } = require('../helpers/validators');
const isNumber = require('lodash.isnumber');
const isInteger = require('lodash.isinteger');
const Question = require('../../database/models/Question');
const Review = require('../../database/models/Review');
const Schedule = require('../../database/models/Schedule');
const { isArray } = require('lodash');

router.route('/users/:userId/services/:id?')
    .all(async (req, res, next) => {
        if (!isValidUUID(req.params.userId)) {
            return res.status(400).json({ error: 'user id inválido' });
        }
        if (!!req.params.id && !isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'user id inválido' });
        }
        next();
    }).post(
        async (req, res) => {
            try {

                const { title, abstract, description, schedule, items } = req.body;

                if (!title | !abstract | !description | !items ) {
                    return res.status(400).json({ error: 'valores inválidos' });
                }

                if (!await User.findOne({ where: { id: req.params.userId } })) {
                    return res.status(400).json({ error: 'usuário informado inválido' });
                }

                console.log(schedule)

                if(req.params.id){

                    const updatedService = await Service.update({
                        title,
                        abstract,
                        description,
                        items: isArray(items) ? items : [],
                        schedule:{
                            active: !!schedule.active ? schedule.active : false,
                            startTime: !!schedule.startTime ? schedule.startTime : 'none',
                            endTime: !!schedule.endTime ? schedule.endTime : 'none',
                            sunday: !!schedule.sunday ? schedule.sunday : false,
                            monday: !!schedule.monday ? schedule.monday : false,
                            tuesday: !!schedule.tuesday ? schedule.tuesday : false,
                            wednesday: !!schedule.wednesday ? schedule.wednesday : false,
                            thursday: !!schedule.thursday ? schedule.thursday : false,
                            friday: !!schedule.friday ? schedule.friday : false,
                            saturday: !!schedule.saturday ? schedule.saturday : false,
                        },                        
                    }, {
                        where: { id: req.params.id, userId: req.params.userId},
                        include: [{association: 'schedule'},{association:'items'}]
                    })

                    return res.status(200).json(updatedService);
                }

                const createdService = await Service.create({
                    title,
                    abstract,
                    description,
                    items,
                    schedule,
                    userId: req.params.userId,
                }, {
                    include: [{association: 'schedule'},{association:'items'}]
                })

                return res.status(200).json({ data: createdService });

            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Server Error!' });
            }
        }
    ).get(
        async (req, res) => {
            try {
                const foundServices = await Service.findAll({ where: { userId: req.params.userId }});
                return res.status(200).json(foundServices);
            } catch (error) {
                console.log(error);
                return res.status(400).json({ error: 'Server Error!'});
            }
        }
    )


router.route('/services')
    .get(
        async (req, res) => {
            try {
                const page = Number(req.query.page);

                if (!isInteger(Number(page)) | page < 1) {
                    return res.status(400).json({ error: 'invalid specified page!' });
                }

                const LIMIT = isInteger(Number(req.query.limit)) ? req.query.limit : 5;

                let foundServices;

                const search = req.query.search ? req.query.search : null

                console.log(search)

                if (search) {       
                    foundServices = await Service.findAndCountAll({
                        limit: LIMIT,
                        offset: Number(page) == 1 ? 0 : (page - 1) * LIMIT,
                        order: [['title', 'ASC']],
                        where: {
                            [Op.or]: [
                                { title: { [Op.like]: search } },
                                { title: { [Op.substring]: search } },
                                { description: { [Op.substring]: search.toLowerCase() } },
                                { description: { [Op.substring]: search.toUpperCase() } },
                                { description: { [Op.substring]: search } }
                            ]
                        }
                    });

                } else {          
                    foundServices = await Service.findAndCountAll({
                        limit: LIMIT,
                        offset: Number(page) == 1 ? 0 : (page - 1) * LIMIT,
                        order: [['title', 'ASC']]
                    })
                };



                return res.status(200).json({
                    ...foundServices,
                    page,
                    totalPages: Math.ceil(foundServices.count / LIMIT),
                    totalItems: foundServices.count
                });


            } catch (error) {
                console.log(error);
                return res.status(400).json({ error: 'Server Error!' })
            }
        }
    )

router.route('/services/:id').all(
    async (req, res, next) => {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'invalid id!' });
        }
        next()
    }
).get(
    async (req, res) => {
        try {
            const foundService = await Service.findOne({ 
                where: { id: req.params.id }, 
                include: [User, Question, Review, {association:'schedule'}, {association: 'items'}] });
            if (!foundService) {
                return res.status(400).json({ error: 'não encontrado!' });
            }
            return res.status(200).json({ data: foundService })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server Error!' });
        }
    }
)


module.exports = app => app.use('/', router);