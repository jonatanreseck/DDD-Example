import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import ProductRepository from "./product.repository";
import Product from "../../domain/product/entity/product";
import OrderItem from "../../domain/checkout/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("Should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1", //id
      product.name,
      product.price,
      product.id,
      3 // qtd
    );

    const order = new Order("123", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    const orderItemUpdate = new OrderItem(
      "1", //id
      product.name,
      product.price,
      product.id,
      5 // qtd
    );
    const orderUpdate = new Order("123", "123", [orderItemUpdate]);

    await orderRepository.update(orderUpdate);

    const orderUpdateModel = await OrderModel.findOne({
      where: { id: orderUpdate.id },
      include: ["items"],
    });

    expect(orderUpdateModel.toJSON()).toStrictEqual({
      customer_id: customer.id,
      id: "123",
      items: [
        {
          id: orderItemUpdate.id,
          name: orderItemUpdate.name,
          order_id: "123",
          price: orderItemUpdate.price,
          product_id: "123",
          quantity: orderItemUpdate.quantity,
        },
      ],
      total: orderUpdate.total(),
    });
  });

  it("Should find one order ", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1", //id
      product.name,
      product.price,
      product.id,
      5 // qtd
    );

    const order = new Order("123", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderFinded = await orderRepository.find(order.id);
    const orderFindModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderFindModel.toJSON()).toStrictEqual({
      customer_id: customer.id,
      id: "123",
      items: [
        {
          id: orderFinded.items[0].id,
          name: orderFinded.items[0].name,
          order_id: orderFinded.id,
          price: orderFinded.items[0].price,
          product_id: orderFinded.items[0].productId,
          quantity: orderFinded.items[0].quantity,
        },
      ],
      total: orderFinded.total(),
    });
  });

  it("Should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "1", //id
      product.name,
      product.price,
      product.id,
      5 // qtd
    );

    const orderItem2 = new OrderItem(
      "2", //id
      product.name,
      product.price,
      product.id,
      7 // qtd
    );

    const orderRepository = new OrderRepository();
    const order1 = new Order("1", customer.id, [orderItem1]);
    const order2 = new Order("2", customer.id, [orderItem2]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
