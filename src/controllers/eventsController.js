"use strict";

const User = require("../models/user")
const Event = require("../models/event")
const Join = require("../models/join")
const Tag = require("../models/tag")
const EventTag = require("../models/eventtag")
const jsonWebToken = require('jsonwebtoken')
const db = require('../models/index')
const httpStatus = require('http-status');
const process = require('../config/process.js');
const multer = require('multer')

module.exports = {
    index: (req, res, next) => {
        db.Event.findAll({
                include: ['User', 'Tag'],
                order: [
                    ['id', 'DESC']
                ],
            })
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
    create: async(req, res, next) => {
        //イベント作成
        const newEvent = await db.sequelize.sync()
            .then(() => db.Event.create({
                    userId: req.session.user.id,
                    title: req.body.title,
                    detail: req.body.detail,
                }).catch((err) => {
                        const data = {
                            title: 'events',
                            login: req.session.user,
                            err: err,
                        }
                        res.render('layout', { layout_name: 'events/add', data });
                    })
            )
        //タグ作成およびイベントとの紐付け
        let tags = JSON.parse(req.body.tags);
        //tagの数だけ繰り返す
        tags.forEach(async function(tag, key ) {
            let findTag = await db.Tag.findOrCreate({
                where: { name: tag.value }
            }).catch((err) => {
                res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
            })
            //イベントとの紐付け
            db.EventTag.create({
                eventId: newEvent.id,
                tagId: findTag[0].id,
            }).catch((err) => {
                res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
            })
        })
    },
    show: async(req, res, next) => {
        const EventId = req.params.id;
        await db.Event.findOne({
            where: {
                id: EventId,
            },
            include: ['User', 'Tag'],
            
        }).then(event => {
            console.log(event)
            let isJoin = false;
            const joinUser = event.User;
            //あなたはそのイベントに参加予定か？
            joinUser.forEach(element => {
                if (element.id == req.session.user.id) {
                    isJoin = true;
                }
            });
            const data = {
                title: 'events/show',
                login: req.session.user,
                event: event,
                isJoin: isJoin,
                err: null
            }
            res.render('layout', { layout_name: 'events/show', data });
        });

    },
    join: async(req, res, next) => {
        //いいねがついているかを判定する。
        const form = {
            userId: req.body.userId,
            eventId: req.body.eventId,
        };
        const join = await db.Join.findOne({
            where: form
        })
        if (join) {
            //既にいいねがついている場合、いいねを外す。
            await db.Join.destroy({
                    where: form
                })
                .then(() => {
                    res.redirect('/events');
                })
                .catch((err) => {
                    res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
                });
        } else {
            //いいねがついていない場合、いいねをつける。
            await db.Join.create(form)
                .then(() => {
                    res.redirect('/events');
                })
                .catch((err) => {
                    res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
                });
        }
    }


}