import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import EventDispatcher from "../../@shared/event-dispatcher";

import { CustomerAddressChangedEvent } from './customerAddressChanged'
import { CustomerCreatedEvent } from './customerCreatedEvent'
import { EnviaConsoleLog1Handler } from "./hander/EnviaConsoleLog1Handler";
import { EnviaConsoleLog2Handler } from "./hander/EnviaConsoleLog2Handler";
import { EnviaConsoleLogHandler } from "./hander/EnviaConsoleLogHandler";

describe('Customer Events', () => {
  it('should register Customer Created Event', () => {
    const eventDispatcher = new EventDispatcher()
    const consoleLog1Handler = new EnviaConsoleLog1Handler()
    const consoleLog2Handler = new EnviaConsoleLog2Handler()
    eventDispatcher.register('CustomerCreatedEvent', consoleLog1Handler)
    eventDispatcher.register('CustomerCreatedEvent', consoleLog2Handler)

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(consoleLog1Handler)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(consoleLog2Handler)
  })

  it('shoudl register Customer Address Changed Event', () => {
    const eventDispatcher = new EventDispatcher()
    const consoleLogHandler = new EnviaConsoleLogHandler()
    eventDispatcher.register('CustomerAddressChangedEvent', consoleLogHandler)

    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(consoleLogHandler)
  })

  it('should notify Customer Created Event', () => {
    const eventDispatcher = new EventDispatcher()
    const consoleLog1Handler = new EnviaConsoleLog1Handler()
    const consoleLog2Handler = new EnviaConsoleLog2Handler()
    eventDispatcher.register('CustomerCreatedEvent', consoleLog1Handler)
    eventDispatcher.register('CustomerCreatedEvent', consoleLog2Handler)
    const spyEventHandler = jest.spyOn(consoleLog1Handler, 'handle')
    const spyEventHandler2 = jest.spyOn(consoleLog2Handler, 'handle')

    const customer = new Customer('1', 'Jonatan');
    const address = new Address("rua das rosas", 123, "35740-010", "Minas Gerais");
    customer.Address = address;

    const customerCreatedEvent = new CustomerCreatedEvent(customer)
    eventDispatcher.notify(customerCreatedEvent)

    expect(spyEventHandler).toBeCalledTimes(1)
    expect(spyEventHandler2).toBeCalledTimes(1)
  })

  it('should notify Customer Change address Event', () => {
    const eventDispatcher = new EventDispatcher()
    const consoleLogHandler = new EnviaConsoleLogHandler()
    eventDispatcher.register('CustomerAddressChangedEvent', consoleLogHandler)
    const spyEventHandler = jest.spyOn(consoleLogHandler, 'handle')

    const customer = new Customer('1', 'Jonatan');
    const address = new Address("rua das rosas", 123, "35740-010", "Pedralva");
    customer.Address = address;

    const address2 = new Address("rua dos lirios", 321, "13330-312", "São Paulo");
    customer.Address = address2;

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({ id: customer.id, name: customer.name, address: customer.Address })
    eventDispatcher.notify(customerAddressChangedEvent)

    expect(spyEventHandler).toBeCalledTimes(1)
  })
})