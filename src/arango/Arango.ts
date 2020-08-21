import { aql, Database } from 'arangojs';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class Arango {
  private _db;

  constructor() {
    this._db = new Database({
      url:'http://185.239.107.17:8529'
    });
    this._db.useDatabase('bamachoob-v1');
    this._db.useBasicAuth('root', 'datafor?me');
  }

  getDB() {
    return this._db;
  }

  getCol(name) {
    return this._db.collection(name);
  }

  getEdgeCol(name) {
    return this._db.edgeCollection(name);
  }

  getGraph(name) {
    const graph = this._db.graph(name);
  }

  async phoneNumberBeUnique(col, uniqueConst) {
    const query = aql`for i in ${col}
    filter i.phoneNumber==${uniqueConst}
    return i`;
    let cursor;
    try {
      cursor = await this._db.query(query);
      // console.log(cursor);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    // console.log(result);
    if (result.length > 0) {
      throw new UnprocessableEntityException(`${uniqueConst} must be unique`);
    }

    // if (result){
    //   throw new UnprocessableEntityException(`${uniqueConst} must be unique`)
    // }
  }

  async getAll(col) {
    const query = aql`for i in ${col} return i`;
    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`endpoint is valid but collection is empty`);
    } else {
      return result;
    }
  }

  async getByPhoneNumber(col, phoneNumber) {
    const query = aql`for i in ${col} 
     filter i.phoneNumber==${phoneNumber}
     return i`;
    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`data with  does not exist`);
    } else {
      return result;
    }
  }

  async getByKey(col, _key) {
    const query = aql`for i in ${col} 
     filter i._key==${_key}
     return i`;

    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`data with key: ${_key} does not exist`);
    } else {
      return result;
    }
  }

  async create(col, data) {
    const query = aql`insert ${data} into ${col} RETURN NEW`;
    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      throw new ConflictException(err);
    }
    return await cursor.all();
  }

  async update(col, data, _key) {
    const exists = await col.documentExists(_key);
    if (exists === false) {
      throw new NotFoundException(`data with key: ${_key} does not exist`);
    }
    const query = aql`
    UPDATE ${_key} WITH ${data} IN ${col} RETURN NEW`;

    try {
      await this._db.query(query);
    } catch (err) {
      throw new ConflictException(err);
    }
    return `document with key ${_key} is updated`;
  }

  async delete(col, _key) {
    const exists = await col.documentExists(_key);
    if (exists === false) {
      throw new NotFoundException(`data with key: ${_key} does not exist`);
    }

    const query = aql`
    REMOVE ${_key} IN ${col}`;
    let cursor;
    try {
      await this._db.query(query);
    } catch (err) {
      throw new ConflictException(err);
    }
    return `document with key ${_key} is deleted`;
  }

  async addEdge(edgeCol, startNode, endNode, data) {
    try {
      await edgeCol.save(data, startNode, endNode);
    } catch (err) {
      return err;
    }

    return 'edge created';
  }

  async getAllEdge(graph, col) {
    const query = aql`for i in ${col}
      FOR v, e, p IN 1..1 any i GRAPH "${graph}"
      return p
       `;
    let cursor;
    try {
      cursor = await this._db.query(query);
      console.log(567);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`endpoint is valid but graph is empty`);
    } else {
      return result;
    }
  }

  async getAllEdgesOfOneNode(key, graph, col) {
    const query = aql`for i in ${col}
      filter i._key==${key}
      FOR v, e, p IN 1..1 any i GRAPH ${graph}
      return p
       `;
    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`endpoint is valid but graph is empty`);
    } else {
      return result;
    }
  }

  updateEdge(edgeCol, data, key) {
    return this.update(edgeCol, data, key);
  }

  deleteEdge(edgeCol, key) {
    return this.delete(edgeCol, key);
  }

  async executeEmptyQuery(query) {
    try {
      await this._db.query(query);
    } catch (err) {
      return err;
    }
  }

  async executeGetQuery(query) {
    let cursor;
    try {
      cursor = await this._db.query(query);
    } catch (err) {
      return err;
    }
    const result = await cursor.all();
    if (result.length == 0) {
      throw new NotFoundException(`endpoint is valid but graph is empty`);
    } else {
      return result;
    }
  }
}
