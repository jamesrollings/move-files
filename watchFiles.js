const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const downloadsFolder = 'C:\\Users\\James.Rollings\\Downloads'

const extensions = {
    'Pictures': ['.png','.jpg','.jpeg'],
    'Documents': ['.docx', 'doc', 'xlsx']
}

const moveFiles = (filePath) => {
    const fileExtension = path.extname(filePath);
    const newDirectory = Object.keys(extensions).find(key => extensions[key].includes(fileExtension))
    if (newDirectory) {
        const newPath = filePath.replace('Downloads', newDirectory);
        fs.renameSync(filePath, newPath)
    }
}

chokidar.watch(downloadsFolder).on('add', strPath => moveFiles(strPath));