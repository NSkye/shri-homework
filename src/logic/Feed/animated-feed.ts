interface Frame {
  transform: string;
}

export class AnimatedFeed {

  public scaleLevel: number = 1;
  private ctx: any | null = null;
  private focusActive: boolean = false;
  private animationInProgress: boolean = false;
  private returnFrames: Frame[] = [];

  constructor(ctx: any) {
    this.ctx = ctx;
  }

  public focusOn(afterAnimation: () => void): void {
    if (this.animationInProgress || this.focusActive) {
      return;
    }
    this.makeAbsolute();
    this.ctx.style.zIndex = 4;
    this.ctx.$refs.videoContainer.style.zIndex = -1;
    this.focusActive = true;
    this.animationInProgress = true;
    this.returnFrames = this.animateTransform(() => {
      this.animationInProgress = false;
      afterAnimation();
    }, 200);
  }

  public focusOff(beforeAnimation: () => void, afterAnimation?: () => void): void {
    if (this.animationInProgress || !this.focusActive) {
      return;
    }
    this.animationInProgress = true;
    beforeAnimation();
    this.animateTransform(() => {
      this.focusActive = false;
      this.animationInProgress = false;
      this.ctx.style.zIndex = 0;
      this.makeStatic();
      this.ctx.$refs.videoContainer.style.zIndex = 'auto';
      afterAnimation && afterAnimation();
    }, 200, this.returnFrames);
  }

  public calculateAbsolutePosition(): any {
    const wrapper = this.ctx.$refs.wrapperDiv;
    return {
      width: `${wrapper.clientWidth}px`,
      height: `${wrapper.clientHeight}px`,
    };
  }

  public animateTransform(cb: () => void, ms: number, frames?: Frame[]): Frame[] {
    const { scale, translate } = this.calculateTransform();
    frames = frames || [
      { transform: 'translate(0) scale(1)' },
      { transform: `${translate} ${scale}` },
    ];
    const player = this.ctx.$refs.videoDiv.animate(frames, {
      duration: ms,
      iterations: 1,
      fill: 'forwards',
    });
    setTimeout(cb, ms);
    player.play();
    return frames.reverse();
  }

  public calculateTransform() {
    const wc = window.innerHeight < this.ctx.$refs.wrapperDiv.parentElement.scrollHeight ?
      getWindowCenter() :
      getElementCenter(this.ctx.$refs.wrapperDiv.parentElement);
    const ec = getElementCenter(this.ctx.$refs.videoDiv);

    const translate = `translate(${wc.x - ec.x}px, ${wc.y - ec.y}px)`;
    const scaleLevel = (this.ctx.$refs.wrapperDiv.parentElement.clientWidth) / this.ctx.$refs.videoDiv.clientWidth;
    const scale = `scale(${scaleLevel})`;
    this.scaleLevel = scaleLevel;
    return {
      scale,
      translate,
    };
  }

  private makeAbsolute(): void {
    if (!this.ctx) { return; }

    this.ctx.style = {
      ...this.ctx.style,
      position: 'absolute',
      ...this.calculateAbsolutePosition(),
    };
  }

  private makeStatic(): void {
    if (!this.ctx) { return; }

    this.ctx.style = {
      ...this.ctx.style,
      position: 'static',
    };
  }
}

/**
 * Получает координаты центра viewport
 */
function getWindowCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

/**
 * Получает координаты центра заданного элемента
 */
function getElementCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const top = rect.top;
  const left = rect.left;

  const y = top + el.clientHeight / 2;
  const x = left + el.clientWidth / 2;

  return { x, y };
}
