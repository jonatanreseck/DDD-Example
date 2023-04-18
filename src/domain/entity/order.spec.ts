import Order from "./order";
import OrderItem from "./order_item";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("Should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("132", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("Should throw error when itens are empty", () => {
        expect(() => {
            let order = new Order("132", "123", []);
        }).toThrowError("Items are required");
    });

    it("Should calculate total", () => {
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
        const order = new Order("o1", "C1", [item1]);
        
        let total = order.total();
        expect(total).toBe(200);

        const order2 = new Order("o1", "C1", [item1, item2]);
        total = order2.total();
        expect(total).toBe(600);
    });

    it("Should throw error if if the item qtd is less or equal 0", () => {
        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "C1", [item]);
        }).toThrowError("Quantity must be greater than 0");
    });

}); 