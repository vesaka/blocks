import Container from '$core/container';
import { watch } from 'vue';

class Audio extends Container {

    constructor(options = {}) {
        super(options);

        this.$listen({
            'audio': ['on', 'off'],
            'block': ['', 'released']
        });

    }
}

export default Audio; 