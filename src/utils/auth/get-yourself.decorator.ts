import { SetMetadata } from '@nestjs/common';

export const getYourSelf = (...getYouSelf: string[]) =>
  SetMetadata('getYourSelf', getYouSelf);
