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
const ServiceOrder = require('../../database/models/ServiceOrder');

router.route('/services/:id/serviceOrders')
.all(
    async (req, res, next) => {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'invalid id!' });
        }
        next();
    }
)
.get(
    async (req, res) => {
        try {            

            const foundServiceOrders = await ServiceOrder.findAll({ 
                where: { userServiceId: req.params.userServiceId},
                include: [{ association: "userService" }, { association: "user" }]
            
            }); 

            return res.status(201).json(foundServiceOrders);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error!"});
        }
    }
    
)

router.route('/users/:userId/serviceOrders')
.all(
    async (req, res, next) => {
        if (!isValidUUID(req.params.userId)) {
            return res.status(400).json({ error: 'invalid id!' });
        }
        next()
    }
)
.get(
    async (req, res) => {
        try {            

            console.log('oi')

            if(req.query.filter){
                const foundServiceOrders = await ServiceOrder.findAll({ 
                    where: { userId : req.params.userId, status: req.query.filter},
                    include: [{ association: "userService" }, { association: "user" }, { association: "service"}]            
                }); 
                return res.status(200).json(foundServiceOrders);
            }

            const foundServiceOrders = await ServiceOrder.findAll({ 
                where: { userId : req.params.userId},
                include: [{ association: "userService" }, { association: "user" }, { association: "service"}]            
            }); 

            return res.status(200).json(foundServiceOrders);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error!"});
        }
    }
    
)

router.route('/serviceOrders')
.post(
    async (req, res) => {
        try {
            
            const { userId, userServiceId, serviceId, date, hour } = req.body;

            const createdServiceOrder = await ServiceOrder.create({
                userId,
                userServiceId,
                serviceId,
                date,
                hour
            });

            return res.status(201).json(createdServiceOrder);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error!"});
        }
    }
)

router.route('/serviceOrders/:id')
.all(
    async (req, res, next) => {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'invalid id!' });
        }
        next();
    }
)
.get(
    async (req, res) => {
        try {
            
            const foundServiceOrder = await ServiceOrder.findOne({ where: {id: req.params.id}});

            return res.status(201).json(foundServiceOrder);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error!"});
        }
    }
)
.put(
    async (req, res) => {
        try {
            
            const foundServiceOrder = await ServiceOrder.findOne({ where: {id: req.params.id}});

            const updated = await foundServiceOrder.setAttributes({
                status: 'accepted',
             }).save();

            return res.status(201).json(updated);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error!"});
        }
    }
)



module.exports = app => app.use('/', router);