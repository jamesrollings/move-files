const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const downloadsFolder = 'C:\\Users\\James.Rollings\\Downloads'

const pictureExtensions = [
    '.png',
    '.jpg',
    '.jpeg'
]

const moveFiles = (filePath) => {
    const parentFolder = path.dirname(filePath).split('\\').reverse()[0]
    const fileExtension = path.extname(filePath);

    if (pictureExtensions.includes(fileExtension)) {
        const newDirectory = 'Pictures'
        const newPath = filePath.replace(parentFolder, newDirectory);
        fs.renameSync(filePath, newPath)
    }
}

chokidar.watch(downloadsFolder).on('add', strPath => moveFiles(strPath));