const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

User.hasMany(Order, { foreignKey: 'usuario_id' });
Order.belongsTo(User, { foreignKey: 'usuario_id' });

Order.hasMany(OrderItem, { foreignKey: 'pedido_id' });
OrderItem.belongsTo(Order, { foreignKey: 'pedido_id' });

Product.hasMany(OrderItem, { foreignKey: 'produto_id' });
OrderItem.belongsTo(Product, { foreignKey: 'produto_id' });

Category.hasMany(Product, { foreignKey: 'categoria_id' });
Product.belongsTo(Category, { foreignKey: 'categoria_id' });

const syncDatabase = async () => {
  await sequelize.sync({ force: false });
};

module.exports = { sequelize, syncDatabase, User, Product, Category, Order, OrderItem };
