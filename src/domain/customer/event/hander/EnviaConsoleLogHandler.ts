import Address from "../../../customer/value-object/address";
import EventHandlerInterface from "../../../@shared/event-handler.interface";
import { CustomerAddressChangedEvent } from '../customerAddressChanged'

export class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
  handle (event: CustomerAddressChangedEvent): void {
    const { name, address, id } = event.eventData as { name: string, address: Address, id: string }
    console.log(`Endereço do cliente: ${id}, ${name}, alterado para: ${address._street}, ${address._number}, ${address._city} - ${address._zip} `)
  }
}