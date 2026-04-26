const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  retailerId: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  items: { 
    type: DataTypes.JSONB, 
    allowNull: false 
  }, // Array of { productId, name, liters, cost }
  total_cost: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  requires_labour: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Placed' 
  } // Placed, Approved, Assigned, Dispatched, Delivered
}, {
  timestamps: true
});

module.exports = Order;
