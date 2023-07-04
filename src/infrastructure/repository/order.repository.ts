import Order from "../../domain/entity/order";
import OrderItem from "../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: ["items"],
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    let orderItems: Array<OrderItem> = [];

    // converto o o list de itens do OrderModel para um list de orderItems // TS Things ??
    orderModel.items.forEach((item) => {
      const ordemItem = new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
      orderItems.push(ordemItem);
    });

    const order = new Order(id, orderModel.customer_id, orderItems);

    return order;
  }

  async findAll(): Promise<Order[]> {
    let ordersModel;
    try {
      ordersModel = await OrderModel.findAll({
        include: ["items"],
      });
    } catch (error) {
      throw new Error("Orders not found");
    }

    let orders: Order[] = [];
    ordersModel.forEach((orderModel) => {
      let orderItems: OrderItem[] = [];
      orderModel.items.forEach((orderItemModel) => {
        let orderItem = new OrderItem(
          orderItemModel.id,
          orderItemModel.name,
          orderItemModel.price,
          orderItemModel.product_id,
          orderItemModel.quantity
        );
        orderItems.push(orderItem);
      });
      let order = new Order(orderModel.id, orderModel.customer_id, orderItems);
      orders.push(order);
    });
    return orders;
  }
}
