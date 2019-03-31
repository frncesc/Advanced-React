import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import { formatDistance } from 'date-fns';
import styled from 'styled-components';
import OrderItemStyles from './styles/OrderItemStyles';


const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

class OrderList extends Component {

  render() {
    return (
      <Query query={ALL_ORDERS_QUERY}>
        {({ data: { orders }, error, loading }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>
          return (
            <>
              <h2>You have {orders.length} orders</h2>
              <ul>{
                orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link href={{
                      pathname: '/order',
                      query: { id: order.id }
                    }}>
                      <a>
                        <div className="order-meta">
                          <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                          <p>{order.items.length} Products</p>
                          <p>{formatDistance(new Date(order.createdAt), new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img key={item.id} src={item.image} alt={item.title} />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))
              }
              </ul>
            </>
          );
        }}
      </Query>
    );
  }
}

export default OrderList;