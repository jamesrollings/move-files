import fs from 'fs/promises';
import watchFiles from '../src/watchFiles';

jest.mock('fs/promises');

const mockedAccess = jest.mocked(fs.access);

describe('watchFiles', () => {
    describe('extensionHasMapping function', () => {
        test('returns true if extension exists', () => {
            expect(watchFiles.extensionHasMapping('.pdf')).toEqual(true);
        })

        test('returns false if extension doesn\'t exist', () => {
            expect(watchFiles.extensionHasMapping('.pem')).toEqual(false);
        })
    })

    describe('pathExists function', () => {
        test('returns true if path exists', async () => {
            mockedAccess.mockResolvedValue(undefined)
            const docPath = 'documents/word.docx';
            const objReturn = await watchFiles.pathExists(docPath)
            expect(objReturn).toBe(true);
            expect(fs.access).toHaveBeenCalled();
            expect(fs.access).toHaveBeenCalledWith(docPath);
        })

        test('returns false if path does not exist', async () => {
            mockedAccess.mockImplementation(() => { throw new Error(); })
            const docPath = 'documents/excel.xlsx';
            const objReturn = await watchFiles.pathExists(docPath)
            expect(objReturn).toBe(false);
            expect(fs.access).toHaveBeenCalled();
            expect(fs.access).toHaveBeenCalledWith(docPath);
        })
    })
})