import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LoginModal from '@/components/LoginModal';
import PrivateRoute from './index';

const mockProps = {
  children: <div />,
  auth: { auth: { username: 'mockadmin' } },
};

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<PrivateRoute.WrappedComponent dispatch={mockDispatch} {...mockProps} />, {
  disableLifecycleMethods: true,
});

describe('test Login page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('render LoginModal component', () => {
    expect(wrapper.find(LoginModal).length).toBe(1);
  });
});
