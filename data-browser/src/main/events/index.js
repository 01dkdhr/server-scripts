export default {
    init() {
        const files = require.context('.', false, /\.js$/);

        files.keys().forEach(key => {
            if (key === './index.js') return;
            const module = files(key).default;
            module && module.init && module.init();
        });
    }
};