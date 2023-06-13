import Container from '$core/container';
import { Audio as ThreeAudio, AudioListener } from 'three';

class Audio extends Container {

    constructor(options = {}) {
        super(options);

        this.sounds = {};
        this.$listen({
            'audio': ['toggle', 'loaded'],
            'tak': ['loaded'],
            'success': ['loaded'],
            'move': ['end'],
            'level': ['end']
        });

        this.audio_toggle(this.$store.sound);
        
    }

    createBuffer(name, buffer, callback = null) {
        const audioListener = new AudioListener();
        this.camera.add(audioListener);
        
        this.sounds[name] = new ThreeAudio(audioListener);
        this.sounds[name].setBuffer(buffer);
        this.scene.add(this.sounds[name]);
        
        if (typeof callback === 'function') {
            callback(this.sounds[name]);
        }
    }

    playBuffer(name) {
        if (!this.$store.sound) {
            return;
        }

        const sound = this.sounds[name];
        if (sound.isPlaying) {
            sound.stop();
        }

       sound.play();
    }

    tak_loaded(buffer) {
        this.createBuffer('tak', buffer);
    }

    success_loaded(buffer) {
        this.createBuffer('success', buffer);
    }

    audio_toggle(enable = true) {
        if(!enable) {
            for(let name in this.sounds) {
                this.sounds[name].stop();
            }
        }
    }

    move_end() {
        this.playBuffer('tak');
    }

    level_end() {
        this.playBuffer('success');
    }
}

export default Audio; 