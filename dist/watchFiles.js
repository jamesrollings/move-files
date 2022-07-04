"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const chalk_1 = __importDefault(require("chalk"));
dotenv_1.default.config();
const folderName = 'Downloads';
const basePath = path_1.default.resolve(process.env.HOMEDRIVE, process.env.HOMEPATH);
const folderToWatch = path_1.default.resolve(basePath, folderName);
const extensions = {
    'Pictures': ['.png', '.jpg', '.jpeg'],
    [`Documents${path_1.default.sep}Word`]: ['.docx', '.doc'],
    [`Documents${path_1.default.sep}PDF`]: ['.pdf'],
    [`Documents${path_1.default.sep}Excel`]: ['.xlsx', '.xls'],
    [`Documents${path_1.default.sep}CSV`]: ['.csv'],
    [`Documents${path_1.default.sep}Text`]: ['.txt', '.log'],
    [`Documents${path_1.default.sep}JSON`]: ['.json'],
    [`Documents${path_1.default.sep}YAML`]: ['.yml', '.yaml'],
    [`Documents${path_1.default.sep}Zipped`]: ['.zip', '.7z', '.rar'],
    [`Documents${path_1.default.sep}Installation`]: ['.exe', '.msi'],
    [`Documents${path_1.default.sep}Javascript`]: ['.js'],
    [`Documents${path_1.default.sep}Python`]: ['.py'],
    [`Documents${path_1.default.sep}Email`]: ['.eml', '.msg'],
    [`Documents${path_1.default.sep}HTMLCSS`]: ['.html', '.css'],
};
function extensionHasMapping(extension) {
    const arrExtensions = Object.values(extensions).flat();
    return arrExtensions.includes(extension);
}
async function moveFiles(filePath) {
    const fileExtension = path_1.default.extname(filePath);
    if (fileExtension.length === 0 || !extensionHasMapping(fileExtension)) {
        console.log(`${chalk_1.default.greenBright(path_1.default.basename(filePath))} hasn't been moved as no mapping exists for ${chalk_1.default.magentaBright(fileExtension)} files.`);
        return;
    }
    const pathWithoutBaseName = filePath.split(path_1.default.sep).slice(0, -1).join(path_1.default.sep);
    if (pathWithoutBaseName !== folderToWatch) {
        console.log(`${chalk_1.default.greenBright(path_1.default.basename(filePath))} exists in subdirectory ${chalk_1.default.redBright(pathWithoutBaseName.replace(basePath, '').replace(`${path_1.default.sep}${folderName}${path_1.default.sep}`, ''))} so won't be moved`);
        return;
    }
    const newDirectory = Object.keys(extensions).filter((key) => extensions[key].includes(fileExtension.toLowerCase()));
    if (newDirectory.length) {
        if (newDirectory.length !== 1) {
            console.log(`Multiple mappings found for ${chalk_1.default.magentaBright(fileExtension)} files, no files of this type will be moved.`);
            return;
        }
        const pathToCheck = path_1.default.resolve(basePath, newDirectory[0]);
        const pathDoesExist = await fs_extra_1.default.pathExists(pathToCheck);
        if (newDirectory[0].includes(path_1.default.sep) && !pathDoesExist) {
            await fs_extra_1.default.mkdir(pathToCheck);
        }
        const newPath = filePath.replace(folderName, newDirectory[0]);
        await fs_extra_1.default.rename(filePath, newPath);
        console.log(`Moved ${chalk_1.default.greenBright(path_1.default.basename(filePath))} to ${chalk_1.default.cyanBright(newPath.replace(basePath, '').substring(1))}`);
    }
}
chokidar_1.default.watch(folderToWatch, { awaitWriteFinish: true, ignorePermissionErrors: true }).on('add', async (strPath) => await moveFiles(strPath));
