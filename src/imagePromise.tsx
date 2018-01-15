import * as React from 'react';
import {Component, ReactNode, SyntheticEvent} from 'react';

export interface ImagePromiseState {
  isErrored: boolean;
  isLoading: boolean;
  src?: string;
}

export interface ImagePromiseProps {
  src: Promise<string> | string;
  loadingPlaceholder?: ReactNode;
  errorPlaceholder?: ReactNode;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;

  [propName: string]: any;
}

class ImagePromise extends Component<ImagePromiseProps, ImagePromiseState> {
  state: ImagePromiseState = {
    isLoading: true,
    isErrored: false
  }
  
  componentDidMount() {
    const {src} = this.props;

    if (typeof src === 'string') {
      this.setState({
        isLoading: false,
        src
      });
    } else {
      src.then(this.onImageLoaded).catch(this.onImageErrored);
    }
  }

  onImageLoaded = (src: string) => {
    this.setState({
      src,
      isLoading: false
    });
  }

  onImageErrored = () => {
    this.setState({
      isErrored: true,
      isLoading: false
    });
  }

  onError = (e: SyntheticEvent<HTMLImageElement>) => {
    const {onError} = this.props;

    this.setState({isLoading: false, isErrored: true});

    onError && onError(e);
  }

  render() {
    const {loadingPlaceholder, errorPlaceholder, ...otherProps} = this.props;
    const {src, isLoading, isErrored} = this.state;

    if (isLoading && loadingPlaceholder) {
      return loadingPlaceholder;
    }

    if (isErrored && errorPlaceholder) {
      return errorPlaceholder;
    }

    return (
      <img 
        {...otherProps} 
        src={src} 
        onError={this.onError} 
      />
    );
  }
}

export default ImagePromise;