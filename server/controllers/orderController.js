const { Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }

    const order = await Order.create({ usuario_id: req.user.id, valor_total: 0, status: 'pendente' });

    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produto ${item.productId} não encontrado` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Estoque insuficiente para ${product.name}` });
      }

      await product.update({ stock: product.stock - item.quantity });
      await OrderItem.create({
        pedido_id: order.id,
        produto_id: product.id,
        quantidade: item.quantity,
        preco_unitario: product.price
      });
      total += Number(product.price) * Number(item.quantity);
    }

    order.valor_total = total;
    await order.save();

    return res.status(201).json({ message: 'Pedido criado', order });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { usuario_id: req.user.id }, include: [OrderItem] });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar pedidos', error: error.message });
  }
};
