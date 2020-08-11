import { Injectable } from '@nestjs/common';

import { aql } from 'arangojs';
import { Arango } from '../arango/Arango';

@Injectable()
export class AddToMenuService {
  col;

  constructor(private arango: Arango) {
    this.col = arango.getCol('products');
  }

  async addCompanyNameToMenuList(data) {
    const { companyName } = data;

    const query = `
          for m in menu
            let current= m.companyName
            let n= push(current,${companyName})
            update m with {companyName:n} in menu
        `;

    await this.arango.executeEmptyQuery(query);
  }
}
