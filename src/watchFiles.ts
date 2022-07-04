import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import chalk from 'chalk';

dotenv.config();

interface Extensions {
  [path: string] : string[]
}

const homeDrive = process.env.HOMEDRIVE ?? '';
const homePath = process.env.HOMEPATH ?? '';

if (homePath.length === 0 || homeDrive.length === 0) {
  process.exit(1);
}

const folderName = 'Downloads';
const basePath = path.resolve(homeDrive, homePath);
const folderToWatch = path.resolve(basePath, folderName);

const extensions: Extensions = {
  'Pictures': ['.png', '.jpg', '.jpeg'],
  [`Documents${path.sep}Word`]: ['.docx', '.doc'],
  [`Documents${path.sep}PDF`]: ['.pdf'],
  [`Documents${path.sep}Excel`]: ['.xlsx', '.xls'],
  [`Documents${path.sep}CSV`]: ['.csv'],
  [`Documents${path.sep}Text`]: ['.txt', '.log'],
  [`Documents${path.sep}JSON`]: ['.json'],
  [`Documents${path.sep}YAML`]: ['.yml', '.yaml'],
  [`Documents${path.sep}Zipped`]: ['.zip', '.7z', '.rar'],
  [`Documents${path.sep}Installation`]: ['.exe', '.msi'],
  [`Documents${path.sep}Javascript`]: ['.js'],
  [`Documents${path.sep}Python`]: ['.py'],
  [`Documents${path.sep}Email`]: ['.eml', '.msg'],
  [`Documents${path.sep}HTMLCSS`]: ['.html', '.css'],
};

function extensionHasMapping(extension: string): boolean {
  const arrExtensions: string[] = Object.values(extensions).flat();
  return arrExtensions.includes(extension);
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (err) {
    return false
  }
}

async function moveFiles(filePath: string) {
  const fileExtension = path.extname(filePath);

  if (fileExtension.length === 0 || !extensionHasMapping(fileExtension)) {
    console.log(`${chalk.greenBright(path.basename(filePath))} hasn't been moved as no mapping exists for ${chalk.magentaBright(fileExtension)} files.`);
    return;
  }

  const pathWithoutBaseName = filePath.split(path.sep).slice(0, -1).join(path.sep);

  if (pathWithoutBaseName !== folderToWatch) {
    console.log(`${chalk.greenBright(path.basename(filePath))} exists in subdirectory ${chalk.redBright(pathWithoutBaseName.replace(basePath, '').replace(`${path.sep}${folderName}${path.sep}`, ''))} so won't be moved`);
    return;
  }

  const newDirectory = Object.keys(extensions).filter((key) => extensions[key].includes(fileExtension.toLowerCase()));

  if (newDirectory.length) {
    if (newDirectory.length !== 1) {
      console.log(`Multiple mappings found for ${chalk.magentaBright(fileExtension)} files, no files of this type will be moved.`);
      return;
    }
  
    const pathToCheck = path.resolve(basePath, newDirectory[0]);
    const pathDoesExist = await pathExists(pathToCheck)
  
    if (newDirectory[0].includes(path.sep) && !pathDoesExist) {
      await fs.mkdir(pathToCheck);
    }
  
    const newPath = filePath.replace(folderName, newDirectory[0]);
    await fs.rename(filePath, newPath);

    console.log(`Moved ${chalk.greenBright(path.basename(filePath))} to ${chalk.cyanBright(newPath.replace(basePath, '').substring(1))}`);
  }
}

chokidar.watch(folderToWatch, { awaitWriteFinish: true, ignorePermissionErrors: true }).on('add', async (strPath) => await moveFiles(strPath));
