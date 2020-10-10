require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const folderName = 'Downloads'
const basePath = path.resolve(process.env.HOMEDRIVE, process.env.HOMEPATH)
const folderToWatch = path.resolve(basePath, folderName)

const extensions = {
    'Pictures': ['.png','.jpg','.jpeg'],
    'Documents\\Word': ['.docx', '.doc'],
    'Documents\\PDF': ['.pdf'],
    'Documents\\Excel': ['.xlsx', '.xls'],
    'Documents\\CSV': ['.csv'],
    'Documents\\Text': ['.txt'],
    'Documents\\JSON': ['.json'],
    'Documents\\YAML': ['.yml', '.yaml'],
    'Documents\\Zipped': ['.zip', '.7z'],
    'Documents\\Installation': ['.exe', '.msi'],
    'Documents\\Javascript': ['.js'],
    'Documents\\Python': ['.py']
}

const moveFiles = (filePath) => {
    if (filePath.split(path.sep).slice(0, -1).join(path.sep) !== folderToWatch) {
        return; // files in sub directories will not be moved
    }
    const fileExtension = path.extname(filePath);
    const newDirectory = Object.keys(extensions).find(key => extensions[key].includes(fileExtension.toLowerCase()))
    if (newDirectory) {
        const pathToCheck = path.resolve(basePath, newDirectory)
        if (newDirectory.includes(path.sep) && !fs.existsSync(pathToCheck)) {
            fs.mkdirSync(pathToCheck)
        }
        const newPath = filePath.replace(folderName, newDirectory);
        fs.renameSync(filePath, newPath)
    } else {
        console.log(`${path.basename(filePath)} hasn't been moved as no mapping exists for ${fileExtension} files.`)
    }
}

chokidar.watch(folderToWatch).on('add', strPath => moveFiles(strPath));