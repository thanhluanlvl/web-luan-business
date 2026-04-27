const fs = require('fs');
const path = require('path');

const srcFiles = [
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_it_computer_1777263120762.png', dest: 'public/vn_it_computer.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_printer_repair_1777263139894.png', dest: 'public/vn_printer_repair.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_signboard_install_1777263155172.png', dest: 'public/vn_signboard_install.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\hero_background_new_1777267591514.png', dest: 'public/hero_background.png' }
];

srcFiles.forEach(file => {
    try {
        fs.copyFileSync(file.src, path.join(__dirname, file.dest));
        console.log(`Copied ${file.src} to ${file.dest}`);
    } catch (err) {
        console.error(`Error copying ${file.src}:`, err.message);
    }
});
