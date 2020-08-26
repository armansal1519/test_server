import { extname } from 'path';
import { ConflictException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new ConflictException('image format is not accepted (check lower case)'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  console.log(file);
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
