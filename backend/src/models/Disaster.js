// src/models/Disaster.js
const { DataTypes } = require('sequelize');
const sequelize = require('./../config/db');

const Disaster = sequelize.define('Disaster', {
    type: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'disasters',
    timestamps: true
});

module.exports = Disaster;
