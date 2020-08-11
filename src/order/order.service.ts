import { Injectable, NotFoundException } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { aql } from 'arangojs';

@Injectable()
export class OrderService {
  edgeCol;
  _db;
  userCol;

  constructor(private arango: Arango) {
    this.userCol = this.arango.getCol('users');
    this.edgeCol = this.arango.getEdgeCol('orders');
    this._db = this.arango.getDB();
  }

  async getAllOrder() {
    const query = aql`for i in users
      FOR v, e, p IN 1..1 any i GRAPH "user_order_product"
      return {"order":e,"user":i,"product":v}
       `;
    return this.arango.executeGetQuery(query);
  }

  async getAllOrderOfOneUser(key) {
    const query = aql`
      for i in users
      filter i._key==${key}
      FOR v, e, p IN 1..1 any i GRAPH "user_order_product"
      return {"order":e,"user":i,"product":v}
       `;
    return this.arango.executeGetQuery(query);
  }

  getOrderByKey(key) {
    return this.arango.getByKey(this.edgeCol, key);
  }

  createOrder(data, startNodeId, endNodeId) {
    return this.arango.addEdge(this.edgeCol, startNodeId, endNodeId, data);
  }

  updateOrder(key, data) {
    return this.arango.updateEdge(this.edgeCol, data, key);
  }

  deleteOrder(key) {
    return this.arango.deleteEdge(this.edgeCol, key);
  }
}
