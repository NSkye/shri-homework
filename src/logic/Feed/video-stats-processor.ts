export class VideoStatsProcessor {

  public motionLevel: number = 0;
  public brightnessLevel: number = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private processingInterval?: number;
  private imgData: Uint8ClampedArray = new Uint8ClampedArray(0);
  private w: number = 0;
  private h: number = 0;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
  }

  public startProcessing() {
    this.w = this.video.videoWidth;
    this.h = this.video.videoHeight;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.height = this.h;
    this.canvas.width = this.w;
    this.processingInterval = setInterval(() => this.processFrame(this.w, this.h), 1000) as unknown as number;
  }

  public kill() {
    clearInterval(this.processingInterval);
  }

  private processFrame(w: number, h: number): void {
    if (!this.ctx) { return; }

    this.ctx.drawImage(this.video, 0, 0, w, h);
    const imgData: Uint8ClampedArray = this.ctx.getImageData(0, 0, w, h).data;
    this.registerFrameDiff(imgData);
    this.registerBrightness(imgData);
    this.imgData = imgData;
  }

  private registerFrameDiff(imgData: Uint8ClampedArray): void {
    if (!this.imgData.length) {
      return;
    }

    let motion: number = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      let ii = 0;
      while (ii < 3) {
        if (this.imgData[i + ii] !== imgData[i + ii]) {
          motion++;
          break;
        }
        ii++;
      }
    }

    motion = (motion / (imgData.length / 4)) * 100;
    this.motionLevel = motion;
  }

  private registerBrightness(imgData: Uint8ClampedArray) {
    const step = Math.floor((imgData.length) / 250) * 4;

    const avgRGBBrightness: number[] = [];
    for (let i = 0; i < imgData.length; i += step) {
      const r = imgData[i];
      const g = imgData[i + 1] || 0;
      const b = imgData[i + 2] || 0;
      avgRGBBrightness.push((r + g + b) / 3);
    }

    const avgBrightness = avgRGBBrightness.reduce((a, b) => a + b) / avgRGBBrightness.length;
    const imgBrightnessPercentage = (avgBrightness / 255) * 100;

    this.brightnessLevel = imgBrightnessPercentage;
  }
}
