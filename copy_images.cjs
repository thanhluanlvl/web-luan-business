const fs = require('fs');
const path = require('path');

const srcFiles = [
    // Old images
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_it_computer_1777263120762.png', dest: 'public/vn_it_computer.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_printer_repair_1777263139894.png', dest: 'public/vn_printer_repair.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\vn_signboard_install_1777263155172.png', dest: 'public/vn_signboard_install.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\hero_background_new_1777267591514.png', dest: 'public/hero_background.png' },
    // New customized images
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\luan_repair_computer_1777274875477.png', dest: 'public/luan_repair_computer.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\luan_printing_shop_1777274889437.png', dest: 'public/luan_printing_shop.png' },
    { src: 'C:\\Users\\nn\\.gemini\\antigravity\\brain\\ce492990-901c-44ad-a67b-cd749f8e7720\\luan_storefront_1777274903215.png', dest: 'public/luan_storefront.png' }
];

srcFiles.forEach(file => {
    try {
        fs.copyFileSync(file.src, path.join(__dirname, file.dest));
        console.log(`Copied ${path.basename(file.src)} -> ${file.dest}`);
    } catch (err) {
        console.error(`Error copying ${path.basename(file.src)}:`, err.message);
    }
});
