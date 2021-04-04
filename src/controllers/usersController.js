"use strict";

const User = require("../models/user")
const jsonWebToken = require('jsonwebtoken')
const db = require('../models/index')
const httpStatus = require('http-status');
const process = require('../config/process.js');
const multer = require('multer');


module.exports = {
    login: async(req, res, next) => {
        res.render('layout', { layout_name: 'login', title: 'login' });
    },
    register: async(req, res, next) => {
        res.render('layout', { layout_name: 'Register', title: 'Register' });
    },
    index: (req, res, next) => {
        db.User.findAll()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                res.render('layout', { layout_name: 'error', title: 'ERROR', msg: 'ユーザー情報取得に失敗しました。' });
                res.sendStatus(500)
            });
    },
    indexView: (req, res) => {
        res.render("layout", { layout_name: 'index', title: 'Index' });
    },
    create: (req, res, next) => {
        const form = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        };
        db.sequelize.sync()
            .then(() => db.User.create(form)
                .then(usr => {
                    const payload = {
                        id: usr.id,
                        email: usr.email,
                        password: usr.password
                    }
                    console.log("payload", payload) //{ id: 1, name: 'Taro', password: 'yamada' }
                    const token = jsonWebToken.sign(payload, 'secret');
                    req.session.token = token;
                    res.redirect('/')
                })
                .catch(error => {
                    res.render('layout', { layout_name: 'error', title: 'ERROR', msg: 'ユーザー作成に失敗しました。' });
                    res.sendStatus(500)
                })
            )
    },
    delete: (req, res, next) => {
        db.sequelize.sync()
            .then(() => db.User.destroy({
                where: { id: req.body.id }
            }))
            .then(usr => {
                res.redirect('/');
            }).catch(error => {
                res.render('layout', { layout_name: 'error', title: 'ERROR', msg: 'ユーザー削除に失敗しました。' });
                res.sendStatus(500)
            });
    },
    apiAuthenticate: async(req, res, next) => {
        await db.User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password,
            }
        }).then(usr => {
            if (usr != null) {
                const payload = {
                    id: usr.id,
                    email: usr.email,
                    password: usr.password
                }
                const token = jsonWebToken.sign(payload, process['JWT_SECRET']);
                req.session.token = token;
                req.session.user = usr;
                next()
            } else {
                res.render('layout', { layout_name: 'error', title: 'ERROR', msg: 'ユーザーが見つかりませんでした。' });
                res.sendStatus(500)
            }
        })
    },
    verifyJWT: (req, res, next) => {
        const token = req.session.token
        if (token) {
            jsonWebToken.verify(token, process['JWT_SECRET'], function(error, decoded) {
                if (error) {
                    return res.json({ success: false, message: 'トークンの認証に失敗しました。' });
                } else {
                    // 認証に成功したらdecodeされた情報をrequestに保存する
                    console.log("認証に成功しました")
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.redirect('/login')
        }
    },
    logout: (req, res, next) => {
        req.session.token = null;
        res.redirect('/login')
    },
    myProf: async(req, res, next) => {
        //userIdを引き取る
        const UserId = req.session.user.id;
        //userIdでユーザー情報を取得
        await db.User.findOne({
            where: {
                id: UserId
            }
        }).then(user => {
            //取得したuser情報をもとに画面にレンダリング
            const data = {
                title: 'マイプロフィール',
                user: req.session.user,
                err: null
            }
            res.render('layout', { layout_name: 'myprof', data });
        })
    },
    imagePost: async(req, res, next) => {
        const upload = multer({ dest: '../public/images/' });
        await upload.single('file')
            .then(() => {
                res.redirect('/')
            }).catch(
                error => {
                    res.render('layout', { layout_name: 'error', title: 'ERROR', msg: error });
                }
            )
    }
}