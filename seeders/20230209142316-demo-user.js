'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username:'admin',
      //↓パスワード：password
      password:'e9253671ba39ab34f6a2470e79dbaaabcb27022daec0c6c2748683522928ea96bf0797e19ef412f7d259329371f8305741960dddab0af3355a865006800bf6ec',
      firstName: 'test',
      lastName: 'test',
      email: 'example@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};