interface ThePointerEvent extends PointerEvent {
  getCoalescedEvents?: () => PointerEvent[];
}

interface PolyfilledPointerEvent extends PointerEvent {
  getCoalescedEvents: () => PointerEvent[];
}

export default class PointerEventsCoalescedEventsPolyfill {

  private coalescedEvents: { [event: string]: PointerEvent[] } = { };

  public clearPolyfill(e: PointerEvent): void {
    delete this.coalescedEvents[e.pointerId];
  }

  public makePolyfill(e: ThePointerEvent): PolyfilledPointerEvent {
    if (!e.getCoalescedEvents) {
      this.addCoalescedEvent(e);
      e.getCoalescedEvents = () => this.getCoalescedEvents(e);
    }

    return e as PolyfilledPointerEvent;
  }

  public clearAllPolyfills() {
    Object.keys(this.coalescedEvents).map(pId => {
      delete this.coalescedEvents[pId];
    });
  }

  private addCoalescedEvent(e: PointerEvent): void {
    if (this.getCoalescedEvents(e).length >= 2) {
      this.coalescedEvents[e.pointerId].shift();
    } else if (this.getCoalescedEvents(e).length === 0) {
      this.coalescedEvents[e.pointerId] = [] as PointerEvent[];
    }
    this.coalescedEvents[e.pointerId].push(e);
  }

  private getCoalescedEvents(e: PointerEvent): PointerEvent[] {
    return this.coalescedEvents[e.pointerId] ? this.coalescedEvents[e.pointerId] : [];
  }
}
