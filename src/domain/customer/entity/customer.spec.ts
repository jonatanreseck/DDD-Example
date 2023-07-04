import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {

        expect(() => {
            let customer = new Customer("", "John");
        }).toThrowError("Id is required");

    });

    it("Should throw error when name is empty", () => {

        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");

    });

    it("Should change name", () => {

        // arrange
        const customer = new Customer("123", "John");
        
        // act
        customer.changeName("João");

        // assert
        expect(customer.name).toBe("João");

    });

    it("Should activate customer", () => {

        // arrange
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "13330-222", "São Paulo");
        customer.Address = address;
        
        // act
        customer.activate();

        // assert
        expect(customer.isActive()).toBe(true);

    });

    it("Should deactivate customer", () => {

        // arrange
        const customer = new Customer("1", "Customer 1");
               
        // act
        customer.desactivate();

        // assert
        expect(customer.isActive()).toBe(false);

    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

    it("Should throw error when address is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is a mandatory to activate a customer");

    });


});