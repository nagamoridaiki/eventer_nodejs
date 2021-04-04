"use strict";

const User = require("../models/user")
const Event = require("../models/event")
const jsonWebToken = require('jsonwebtoken')
const db = require('../models/index')
const httpStatus = require('http-status');
const process = require('../config/process.js');
const multer = require('multer')

module.exports = {
    index: (req, res, next) => {
        db.Event.findAll()
            .then(async(event) => {
                const data = {
                    title: 'Event',
                    login: req.session.user,
                    content: event,
                }
                res.render('layout', { layout_name: 'events/list', data });
            });
    },
    add: (req, res, next) => {
        const data = {
            title: 'Events/Add',
            login: req.session.user,
            err: null
        }
        res.render('layout', { layout_name: 'events/add', data });
    },
    create: (req, res, next) => {
        const form = {
            userId: req.session.user.id,
            title: req.body.title,
            detail: req.body.detail,
        };
        db.sequelize.sync()
            .then(() => db.Event.create(form)
                .then(brd => {
                    res.redirect('/');
                })
                .catch((err) => {
                    const data = {
                        title: 'events',
                        login: req.session.user,
                        err: err,
                    }
                    res.render('layout', { layout_name: 'events/add', data });
                })
            )
    },





}