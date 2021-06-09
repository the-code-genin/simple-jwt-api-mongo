import fs from 'fs';
import path from 'path';
import randomString from './random-string';

export default function UploadFile(fileData: string, to: string): string {
    if (!/^data\:.+\/.+\;base64\,.+$/i.test(fileData)) throw new Error('Invalid file uploaded')


    // Get the file extension
    let mimeType = fileData.split(';')[0].split(':', 2)[1];
    if (!/^.+\/.+$/.test(mimeType)) throw new Error('Invalid file mime.');
    let fileExtension = mimeType.split('/', 2)[1];


    // Generate a random file name
    let randomName = randomString(100);
    let fileName = [randomName, String(Math.floor(Math.random() * 999999)) + '.' + fileExtension]
        .join(' ')
        .replace(/\s+/g, '-');


    // Write the file to local storage
    let writeStream = fs.createWriteStream(path.resolve(to, fileName));
    writeStream.write(Buffer.from(fileData.split(',', 2)[1], 'base64'));
    writeStream.close();


    // Return the uploaded file name
    return fileName;
}