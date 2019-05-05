import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<Item/>', () => {
  const wrapper = shallow(<ItemComponent item={fakeItem} />);
  it('renders image properly', () => {
    const img = wrapper.find('img');
    expect(img.prop('src')).toBe(fakeItem.image);
    expect(img.prop('alt')).toBe(fakeItem.title);
  });

  it('renders title and price properly', () => {
    expect(wrapper.find('PriceTag').children().text()).toBe('$50');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders out the buttons properly', () => {
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('AddToCart')).toHaveLength(1);
    expect(buttonList.find('DeleteItem')).toHaveLength(1);
  });

});