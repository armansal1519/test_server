import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { UserAuthService } from '../user-auth/user-auth.service';

@Injectable()
export class ArmanService {
  armanCol;
  constructor(
    private arango: Arango,
    private userAuthService: UserAuthService,
  ) {
    this.armanCol = arango.getCol('arman');
  }

  async create(data) {
    data['date'] = Date.now();
    await this.userAuthService.sendValidCode('09033331022', '000001');
    return await this.arango.create(this.armanCol, data);
  }
  async get() {
    return await this.arango.getAll(this.armanCol);
  }
}
