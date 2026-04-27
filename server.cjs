const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
// Serve the public folder for images
app.use(express.static(path.join(__dirname, 'public')));

// Set up storage for multer (images will be saved in public/uploads)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const dataFilePath = path.join(__dirname, 'projects.json');

// Read data
const getProjects = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Write data
const saveProjects = (projects) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
};

// API: Get all projects
app.get('/api/projects', (req, res) => {
    res.json(getProjects());
});

// API: Login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'Langvan123@@') { // Simple hardcoded password
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Sai mật khẩu!' });
    }
});

// Middleware to check fake token
const checkAuth = (req, res, next) => {
    if (req.headers.authorization === 'Bearer fake-jwt-token') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// API: Add project
app.post('/api/projects', checkAuth, upload.array('images', 10), (req, res) => {
    const projects = getProjects();
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    
    const newProject = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        description: req.body.description || '',
        images: images,
        image: images.length > 0 ? images[0] : '/luan_storefront.png' // Main cover image
    };
    
    projects.unshift(newProject);
    saveProjects(projects);
    res.json(newProject);
});

// API: Delete project
app.delete('/api/projects/:id', checkAuth, (req, res) => {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== parseInt(req.params.id));
    saveProjects(projects);
    res.json({ success: true });
});

// API: Update project
app.put('/api/projects/:id', checkAuth, upload.array('images', 10), (req, res) => {
    let projects = getProjects();
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Not found' });

    let newImages = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    
    // Parse existing images to keep from the client (since client sends JSON array of old images)
    let keptImages = [];
    if (req.body.existingImages) {
        try {
            keptImages = JSON.parse(req.body.existingImages);
        } catch(e) {}
    }

    const finalImages = [...keptImages, ...newImages];

    projects[index] = {
        ...projects[index],
        title: req.body.title,
        category: req.body.category,
        description: req.body.description || projects[index].description,
        images: finalImages,
        image: finalImages.length > 0 ? finalImages[0] : projects[index].image
    };

    saveProjects(projects);
    res.json(projects[index]);
});

// Proxy API cho n8n (bỏ qua CORS)
const https = require('https');

app.post('/api/chat', (req, res) => {
    const data = JSON.stringify(req.body);

    const options = {
        hostname: 'n8nluan.suamayinanduong.com',
        port: 443,
        path: '/webhook/94d9615e-2759-4eb4-bbf3-0b29e18d4cbc',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            if (response.statusCode >= 400) {
                return res.status(response.statusCode).json({ 
                    error: true, 
                    message: `Server n8n báo lỗi HTTP ${response.statusCode}: ${body || 'Không có chi tiết'}` 
                });
            }
            try {
                res.json(JSON.parse(body));
            } catch(e) {
                res.json({ text: body });
            }
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ error: true, message: `Node.js không thể gọi n8n: ${error.message}` });
    });

    request.write(data);
    request.end();
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
