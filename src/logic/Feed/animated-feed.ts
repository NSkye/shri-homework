export interface ComponentStyle {
  position: string,
  left: string,
  top: string,
  width: string,
  height: string,
  transform: string,
  zIndex: number | string
}

export interface VideoElementStyle {
  filter?: string,
  zIndex: number | string
}

export class AnimatedFeed {
  private focusActive: boolean = false;
  private animationInProgress: boolean = false;
  private returnFrames: Keyframe[] = [];
  
  private wrapperDiv: HTMLElement
  private videoDiv: HTMLElement
  public videoDivStyle: ComponentStyle = {
    position: 'static',
    left: 'auto',
    top: 'auto',
    width: '100%',
    height: '100%',
    transform: 'none',
    zIndex: 0,
  }
  public videoElementStyle: VideoElementStyle = {
    zIndex: 'auto',
  }

  public scaleLevel: number = 1;

  constructor(wrapperDiv: HTMLElement, videoDiv: HTMLElement) {
    this.videoDiv = videoDiv;
    this.wrapperDiv = wrapperDiv;
  }

  public focusOn(afterAnimation: () => void): void {
    if (this.animationInProgress || this.focusActive) {
      return;
    }
    this.makeAbsolute();
    this.videoDivStyle.zIndex = 4;
    this.videoElementStyle.zIndex = -1;
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
      this.videoDivStyle.zIndex = 0;
      this.makeStatic();
      this.videoElementStyle.zIndex = 'auto';
      afterAnimation && afterAnimation();
    }, 200, this.returnFrames);
  }

  public calculateAbsolutePosition(): {width: string, height: string} {
    const wrapper = this.wrapperDiv;
    return {
      width: `${wrapper.clientWidth}px`,
      height: `${wrapper.clientHeight}px`,
    };
  }

  public animateTransform(cb: () => void, ms: number, frames?: Keyframe[]): Keyframe[] {
    const { scale, translate } = this.calculateTransform();
    frames = frames || [
      { transform: 'translate(0) scale(1)' } as Keyframe,
      { transform: `${translate} ${scale}` } as Keyframe,
    ];
    const player = this.videoDiv.animate(frames, {
      duration: ms,
      iterations: 1,
      fill: 'forwards',
    });
    setTimeout(cb, ms);
    player.play();
    return frames.reverse();
  }

  public calculateTransform() {
    const outerElement : HTMLElement = this.wrapperDiv.parentElement || document.querySelector('body') as HTMLElement;

    const wc = window.innerHeight < outerElement.scrollHeight ?
      getWindowCenter() :
      getElementCenter(outerElement);
    const ec = getElementCenter(this.videoDiv);

    const translate = `translate(${wc.x - ec.x}px, ${wc.y - ec.y}px)`;
    const scaleLevel = (outerElement.clientWidth) / this.videoDiv.clientWidth;
    const scale = `scale(${scaleLevel})`;
    this.scaleLevel = scaleLevel;
    return {
      scale,
      translate,
    };
  }

  private makeAbsolute(): void {
    this.videoDivStyle = {
      ...this.videoDivStyle,
      position: 'absolute',
      ...this.calculateAbsolutePosition(),
    };
  }

  private makeStatic(): void {
    this.videoDivStyle = {
      ...this.videoDivStyle,
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
