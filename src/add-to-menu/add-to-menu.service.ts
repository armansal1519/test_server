import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Arango } from '../arango/Arango';

@Injectable()
export class AddToMenuService {
  col;

  constructor(private arango: Arango) {
    this.col = arango.getCol('menu');
  }

  async getMenu() {
    return await this.arango.getAll(this.col);
  }

  async addValueToMenuList(data) {
    const { name, value } = data;
    if (name === undefined || value === undefined) {
      throw new NotFoundException('name and value of menu cant be undefined');
    }

    const query = `
          for m in menu
            let current= m.${name}
            let n= push(current,"${value}")
            update m with {${name}:n} in menu
        `;
    return await this.arango.executeEmptyQuery(query);
  }

  async removeValueFromMenuList(data) {
    const { name, value } = data;
    if (name === undefined || value === undefined) {
      throw new NotFoundException('name and value of menu cant be undefined');
    }
    if (value === '-') {
      throw new ConflictException('you cant delete -');
    }

    const query = `
          for m in menu
          let a= REMOVE_NTH (m.${name},POSITION( m.${name}, "${value}", true ))
          update m with {${name}:a} in menu
        `;
    return await this.arango.executeEmptyQuery(query);
  }
}
