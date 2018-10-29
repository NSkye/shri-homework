import PointerEventsCoalescedEventsPolyfill from '@/libs/pointer-events-coalesced-events-polyfill';

type percents = number;
type proportion = number;
type px = number;

interface PolyfilledPointerEvent extends PointerEvent {
  getCoalescedEvents: () => PointerEvent[];
}

interface PointerEventsNamedCollection {
  [event: string]: PointerEvent;
}

export default class Camera {

  public zoom: proportion;
  public position: px;
  public brightness: percents;

  private readonly speed: number = 5;

  private element: HTMLElement;
  private coalescedEvents: PointerEventsCoalescedEventsPolyfill;
  private trackedEvents: { [event: string]: PolyfilledPointerEvent | PointerEvent } = { };

  constructor(element: HTMLElement, options?: {zoom?: proportion, position?: px, brightness?: percents}) {
    this.element = element;
    this.applyEventListeners();
    this.coalescedEvents = new PointerEventsCoalescedEventsPolyfill();

    this.zoom = (options && options.hasOwnProperty('zoom') && options.zoom) || 1;
    this.position = (options && options.hasOwnProperty('position') && options.position) || 0;
    this.brightness = (options && options.hasOwnProperty('brightness') && options.brightness) || 100;
  }

  public destroy() {
    Object.keys(this.trackedEvents).map(pId => {
      delete this.trackedEvents[pId];
    });

    this.coalescedEvents.clearAllPolyfills();
  }

  private applyEventListeners(): void {
    const listeners: Array<[ string, (e: PointerEvent) => void ]> = [
      [ 'touchmove', (e: Event): void => e.preventDefault() ],
      [ 'pointerdown', this.registerPointerDown ],
      [ 'pointermove', this.registerPointerMove ],
      [ 'pointerup', this.registerPointerDeath ],
      [ 'pointercancel', this.registerPointerDeath ],
      [ 'pointerleave', this.registerPointerDeath ],
    ];

    listeners.map(listener => {
      const eName = listener[0];
      const eFunc = listener[1].bind(this);

      this.element.addEventListener(eName, eFunc);
    });
  }

  private registerPointerDown(e: PointerEvent): void {
    this.element.setPointerCapture(e.pointerId);
    this.trackedEvents[e.pointerId] = e;
  }

  private registerPointerMove(e: PointerEvent): void {
    e.preventDefault();
    if (!this.trackedEvents.hasOwnProperty(e.pointerId)) {
      return;
    }
    this.coalescedEvents.makePolyfill(e);
    this.trackedEvents[e.pointerId] = e as PolyfilledPointerEvent;
    this.useGestures(e as PolyfilledPointerEvent);
  }

  private registerPointerDeath(e: PointerEvent): void {
    this.coalescedEvents.clearPolyfill(e);
    if (this.trackedEvents.hasOwnProperty(e.pointerId)) {
      this.element.releasePointerCapture(e.pointerId);
      delete this.trackedEvents[e.pointerId];
    }
  }

  private useGestures(e: PolyfilledPointerEvent): void {
    const touchCount: number = Object.keys(this.trackedEvents).length;

    if (touchCount === 1) {
      this.moveCamera(e);
    } else if (touchCount === 2) {
      this.doPinch();
      this.doZoom();
    }
  }

  private moveCamera(e: PolyfilledPointerEvent): void {
    const prevEvents: PointerEvent[] = [...e.getCoalescedEvents()];
    const prevX: px = prevEvents.length > 1 ? prevEvents[prevEvents.length - 2].clientX : e.clientX;
    const currX: px = e.clientX;
    const delta: px = (prevX - currX) * this.speed;

    this.position = this.position - delta;
  }

  private doPinch(): void {
    const deadzone: percents = 1;

    const { e1Start, e1End, e2Start, e2End } = this.getRelevantEvents();

    const start: number = Math.atan2((e2Start.clientY - e1Start.clientY), (e2Start.clientX - e1Start.clientX));
    const end: number = Math.atan2((e2End.clientY - e1End.clientY), (e2End.clientX - e1End.clientX));
    const delta: percents = (end - start) * 50;

    const nextBrightness: percents = delta + this.brightness;
    if (Math.abs(delta) > deadzone) {
      this.brightness = (nextBrightness <= 0) ? 0 : ((nextBrightness >= 400) ? 400 : nextBrightness);
    }
  }

  private doZoom(): void {
    const deadzone: proportion = 0.02;

    const { e1Start, e1End, e2Start, e2End } = this.getRelevantEvents();

    const start: number = Math.pow(
        Math.pow(e2Start.clientX - e1Start.clientX, 2) +
        Math.pow(e2Start.clientY - e1Start.clientY, 2),
      1 / 2);
    const end: number = Math.pow(
        Math.pow(e2End.clientX - e1End.clientX, 2) +
        Math.pow(e2End.clientY - e1End.clientY, 2),
      1 / 2);
    const delta: proportion = (end - start) / 100;

    const nextZoom = delta + this.zoom;
    if (Math.abs(delta) > deadzone) {
      this.zoom = (nextZoom < 1) ? 1 : ((nextZoom > 5) ? 5 : nextZoom);
    }
  }

  private getRelevantEvents(): PointerEventsNamedCollection {
    const [ e1, e2 ]: PolyfilledPointerEvent[] = Object.keys(this.trackedEvents)
      .map(pId => this.trackedEvents[pId]) as PolyfilledPointerEvent[];
    const [ e1Start, e1End ]: PointerEvent[] = e1.getCoalescedEvents();
    const [ e2Start, e2End ]: PointerEvent[] = e2.getCoalescedEvents();

    return { e1Start, e1End, e2Start, e2End };
  }
}
