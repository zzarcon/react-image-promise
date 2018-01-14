import * as React from 'react';
import {Component} from 'react';
import Image from '../src';
import {AppWrapper, StyledImage} from './styled';

const src = 'https://media.giphy.com/media/UqRjmjfhkVxEQ/giphy.gif';
const promisedWithValidSrc = new Promise<string>((resolve) => {
  setTimeout(() => resolve(src), 1500);
});
const promisedLateValidSrc = new Promise<string>((resolve) => {
  setTimeout(() => resolve(src), 3000);
});
const erroredSrc = 'foo.bar.png';
const errorPlaceholder = <div>Error loading image</div>;
const loadingPlaceholder = <div>Loading...</div>;
const promisedWithErroredSrc = new Promise<string>((resolve) => {
  setTimeout(() => resolve(erroredSrc), 1500);
});
const erroredPromise = new Promise<string>((resolve, reject) => {
  reject('Foo');
});

export default class App extends Component {
  onError = (e: any) => {
    console.log('onError', e);
  }

  render() {

    return (
      <AppWrapper>
        <Image src={src} />
        <StyledImage src={src} />
        <Image src={promisedWithValidSrc} />
        <Image src={promisedLateValidSrc} loadingPlaceholder={loadingPlaceholder} />
        <Image src={erroredSrc} errorPlaceholder={errorPlaceholder} onError={this.onError} />
        <Image src={promisedWithErroredSrc} errorPlaceholder={errorPlaceholder} />
        <Image src={erroredPromise} errorPlaceholder={errorPlaceholder} />
      </AppWrapper>
    );
  }
}