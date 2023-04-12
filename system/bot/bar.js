import { SingleBar, Presets }  from 'cli-progress';

class Bar {

    constructor(duration) {
        this.instance = new SingleBar({
            format: ' {bar} {percentage}% | {value}/{total} seconds',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });

        this.duration = duration || 30;        
        this.running = false;

    }


    start() {
        this.begin = new Date().getTime();
        this.end = this.begin + this.duration * 1000;
        this.currentSeconds = 0;
        this.running = true;
        this.instance.start(this.duration, 0, { timer: this.formatTimer(0) });
    }

    update() {
        const { instance, begin, end } = this;
        const now = new Date().getTime();
        instance.increment();
        
        const seconds = Math.floor((now - begin) / 1000);
        instance.update(seconds, { timer: this.formatTimer(seconds) });

        if (now >= end) {
            instance.stop();
            this.running = false;
        }
    }
    
    formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
    
    isReady() {
        return false === this.running;
    }
}

export default Bar;

