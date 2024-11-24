class Sound {
  sound: HTMLAudioElement;
  constructor(source: string, vol?: number) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = vol ?? 0.8;
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play();
  }
  volume(vol: number) {
    this.sound.volume = vol;
  }
  stop() {
    this.sound.pause();
  }
}

export const buttonPress = new Sound("/sounds/button.mp3", 0.3);
