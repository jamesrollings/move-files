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
    'Documents\\Text': ['.txt', '.log'],
    'Documents\\JSON': ['.json'],
    'Documents\\YAML': ['.yml', '.yaml'],
    'Documents\\Zipped': ['.zip', '.7z', '.rar'],
    'Documents\\Installation': ['.exe', '.msi'],
    'Documents\\Javascript': ['.js'],
    'Documents\\Python': ['.py']
}

const moveFiles = (filePath) => {
    const pathWithoutBaseName = filePath.split(path.sep).slice(0, -1);
    if (pathWithoutBaseName.join(path.sep) !== folderToWatch) {
        console.log(`${path.basename(filePath)} exists in subdirectory: ${pathWithoutBaseName[pathWithoutBaseName.length - 1]} so won't be moved`)
        return;
    }
    const fileExtension = path.extname(filePath);
    const newDirectory = Object.keys(extensions).filter(key => extensions[key].includes(fileExtension.toLowerCase()))
    if (newDirectory.length) {
        if (newDirectory.length !== 1) {
            console.log(`Multiple mappings found for ${fileExtension} files, no files of this type will be moved.`)
            return;
        }
        const pathToCheck = path.resolve(basePath, newDirectory[0])
        if (newDirectory[0].includes(path.sep) && !fs.existsSync(pathToCheck)) {
            fs.mkdirSync(pathToCheck)
        }
        const newPath = filePath.replace(folderName, newDirectory[0]);
        fs.renameSync(filePath, newPath)
    } else {
        console.log(`${path.basename(filePath)} hasn't been moved as no mapping exists for ${fileExtension} files.`)
    }
}

chokidar.watch(folderToWatch).on('add', strPath => moveFiles(strPath));