'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
                name: 'Taro',
                password: 'yamada',
                email: 'taro@yamada.jp',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hanako',
                password: 'flower',
                email: 'hanako@flower.com',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jiro',
                password: 'change',
                email: 'jiro@change.com',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Sachiko',
                password: 'happy',
                email: 'sachiko@happy.jp',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async(queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};