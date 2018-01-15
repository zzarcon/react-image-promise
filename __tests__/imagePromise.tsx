import * as React from 'react';
import {shallow} from 'enzyme';
import Image from '../src';

describe('ImagePromise', () => {
  const src = 'valid-src';
  const erroredSrc = 'foo.bar.png';
  const lateSrc = (): Promise<string> => new Promise((resolve) => {
    setTimeout(() => resolve(src), 10);
  });
  const createErroredSrc = (): Promise<string> => Promise.reject('foo');
  const loadingElement = <div>loading</div>;
  const errorPlaceholder = <div>error</div>;

  test('should render an image when src is a string', () => {
    const component = shallow(<Image src={src} />);

    expect(component.getElement().type).toBe('img');
    expect(component.prop('src')).toEqual(src);
  });

  test('should render loading component while image is loading', async () => {
    const srcPromise = lateSrc();
    const component = shallow(<Image src={srcPromise} loadingPlaceholder={loadingElement} />);

    expect(component.find('div').text()).toEqual('loading');

    await srcPromise;

    component.update();

    expect(component.find('img').prop('src')).toEqual(src);   
  });

  test('should render error placeholder if src is errored', () => {
    const component = shallow(<Image src={erroredSrc} errorPlaceholder={errorPlaceholder} />);

    component.find('img').simulate('error');
    expect(component.find('div').text()).toEqual('error');
  });

  test('should call onError if an error occurs', () => {
    const onError = jest.fn();
    const component = shallow(<Image src={erroredSrc} onError={onError} />);

    component.find('img').simulate('error');
    expect(onError).toBeCalled();
  });

  test('should spread all passed properties', () => {
    const onLoad = jest.fn();
    const component = shallow(<Image src={erroredSrc} onLoad={onLoad} className="custom-class" />);

    component.find('img').simulate('load');
    expect(onLoad).toBeCalled();
    expect(component.getElement().props.className).toEqual('custom-class');
  });

  test('should render error placeholder if promise fails', async () => {
    const src = createErroredSrc();
    const component = shallow(<Image src={src} errorPlaceholder={errorPlaceholder} />);

    try {
      await src;
      throw new Error();
    } catch (e) {
      component.update();
      expect(component.find('div').text()).toEqual('error');
    }
  });

  test('should render error placeholder if promise resolves with an errored src', async () => {
    const errored = Promise.resolve(erroredSrc);
    const component = shallow(<Image src={errored} errorPlaceholder={errorPlaceholder} />);

    try {
      await errored;
      component.find('img').simulate('error');
      throw new Error();
    } catch (e) {
      component.update();
      expect(component.find('div').text()).toEqual('error');
    }
  });
});