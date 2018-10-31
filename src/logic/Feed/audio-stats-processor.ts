export class AudioStatsProcessor {

  public volumeLevel: number = 0;
  private audioCtx: AudioContext;
  private video: HTMLVideoElement;
  private audioAnalyser: ScriptProcessorNode | null = null;
  private audioSource: AudioNode | null = null;

  constructor(video: HTMLVideoElement) {
    interface GlobalNamespace extends Window {
      AudioContext?: {new ():AudioContext};
      webkitAudioContext?: {new ():AudioContext};
    }

    const globalNamespace = window as GlobalNamespace;
    const wAudioContext: { new ():AudioContext } | undefined = globalNamespace.AudioContext || globalNamespace.webkitAudioContext;

    if (wAudioContext) {
      this.audioCtx = (new wAudioContext());
    } else {
      throw Error('Browser doesnt support audiocontext')
    }
    
    this.video = video;
    this.processAudio = this.processAudio.bind(this);
  }

  public startProcessing(): void {
    this.audioAnalyser = this.audioCtx.createScriptProcessor(1024, 1, 1);
    this.audioSource = this.audioCtx.createMediaElementSource(this.video);
    if (!this.audioAnalyser || !this.audioSource) { return; }
    this.audioAnalyser.connect(this.audioCtx.destination);
    this.audioSource.connect(this.audioAnalyser);
    this.audioAnalyser.addEventListener('audioprocess', this.processAudio);
  }

  public kill() {
    this.audioAnalyser && this.audioAnalyser.removeEventListener('audioprocess', this.processAudio);
    this.audioAnalyser && this.audioAnalyser.disconnect();
    this.audioSource && this.audioSource.disconnect();
  }

  private processAudio(e: AudioProcessingEvent | Event) {
    const out = (e as AudioProcessingEvent).outputBuffer.getChannelData(0);
    const int = (e as AudioProcessingEvent).inputBuffer.getChannelData(0);

    let maxVolume: number = 0;
    for (let i = 0; i < int.length; i++) {
      out[i] = int[i];
      maxVolume = Math.max(int[i], maxVolume);
      this.volumeLevel = Number((maxVolume * 100).toFixed(2));
    }
  }
}
