import React, { Component } from 'react';

import HeaderBar from './HeaderBar';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <HeaderBar />
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}
