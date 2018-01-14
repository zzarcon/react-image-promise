import * as React from 'react';
import {shallow} from 'enzyme';
import Image from '../src';

describe('ImagePromise', () => {
  const src = 'valid-src';
  const lateSrc = (): Promise<string> => new Promise((resolve) => {
    setTimeout(() => resolve(src), 10);
  });
  const loadingElement = <div>loading</div>;

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
});