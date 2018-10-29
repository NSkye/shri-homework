export class AudioStatsProcessor {
  private audioCtx : AudioContext
  private video : HTMLVideoElement
  private audioAnalyser : ScriptProcessorNode | null = null
  private audioSource : AudioNode | null = null

  public volumeLevel: number = 0

  constructor(video: HTMLVideoElement) {
    interface GlobalNamespace extends Window {
      AudioContext?: any,
      webkitAudioContext?: any
    }
 
    this.audioCtx = new (
        (window as GlobalNamespace).AudioContext || 
        (window as GlobalNamespace).webkitAudioContext
      )();
    this.video = video;
    this.processAudio = this.processAudio.bind(this);
  }

  public startProcessing () : void {
    this.audioAnalyser = this.audioCtx.createScriptProcessor(1024, 1, 1);
    this.audioSource = this.audioCtx.createMediaElementSource(this.video);
    if (!this.audioAnalyser || !this.audioSource) return;
    this.audioAnalyser.connect(this.audioCtx.destination);
    this.audioSource.connect(this.audioAnalyser);
    this.audioAnalyser.addEventListener('audioprocess', this.processAudio)
  }

  private processAudio (e : AudioProcessingEvent | Event) {
    const out = (e as AudioProcessingEvent).outputBuffer.getChannelData(0);
    const int = (e as AudioProcessingEvent).inputBuffer.getChannelData(0);

    let maxVolume : number = 0;
    for (let i = 0; i < int.length; i++) {
      out[i] = int[i];
      maxVolume = Math.max(int[i], maxVolume);
      this.volumeLevel = Number((maxVolume * 100).toFixed(2));
    }
  }

  public kill() {
    this.audioAnalyser && this.audioAnalyser.removeEventListener('audioprocess', this.processAudio);
    this.audioAnalyser && this.audioAnalyser.disconnect();
    this.audioSource && this.audioSource.disconnect();
  }
}