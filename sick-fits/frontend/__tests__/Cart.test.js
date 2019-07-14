import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

import { ApolloConsumer } from 'react-apollo';

const user = fakeUser();
const cartItem = fakeCartItem();

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...user,
        },
        cart: [
          cartItem,
        ]
      }
    },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: {
      data: {
        cartOpen: true,
      }
    }
  }
];

describe('<Cart/>', () => {
  it('renders and matches snappy', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    await wait();
    expect(toJSON(wrapper.find('header'))).toMatchSnapshot();
    // Just one item on the cart?
    //expect(wrapper.find('CartItem')).toHaveLength(1);



  });
});
