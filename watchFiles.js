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
// Doesn't handle files inside folders yet
const moveFiles = (filePath) => {
    const fileExtension = path.extname(filePath);
    const newDirectory = Object.keys(extensions).find(key => extensions[key].includes(fileExtension))
    if (newDirectory) {
        const pathToCheck = path.resolve(basePath, newDirectory)
        if (newDirectory.includes('\\') && !fs.existsSync(pathToCheck)) {
            fs.mkdirSync(pathToCheck)
        }
        const newPath = filePath.replace(folderName, newDirectory);
        fs.renameSync(filePath, newPath)
    } else {
        console.log(`${path.basename(filePath)} hasn't been moved as no mapping exists.`)
    }
}

chokidar.watch(folderToWatch).on('add', strPath => moveFiles(strPath));