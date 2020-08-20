import { Injectable } from '@nestjs/common';

import { aql } from 'arangojs';
import { Arango } from '../arango/Arango';

@Injectable()
export class AddToMenuService {
  col;

  constructor(private arango: Arango) {
    this.col = arango.getCol('menu');
  }

  async addCompanyNameToMenuList(data) {
    const { name, value } = data;

    const query = `
          for m in menu
            let current= m.${name}
            let n= push(current,"${value}")
            update m with {${name}:n} in menu
        `;

    return await this.arango.executeEmptyQuery(query);
  }
}
