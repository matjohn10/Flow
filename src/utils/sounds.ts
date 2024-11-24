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

export const buttonPress = new Sound("/sounds/button2.mp3", 0.1);
export const gamePress = new Sound("/sounds/button2.mp3", 0.15);
export const beeping = new Sound("/sounds/beep.mp3", 0.15);
export const endGame = new Sound("/sounds/horn.mp3", 0.2);
export const gameSound = new Sound("/sounds/bg-sound.mp3", 0.03);
