import React, { Component } from 'react';
import Window from '../Utils/Window';
import optionalRequire from '../Utils/OptionalRequire';
const electron = optionalRequire('electron');

const styles = {
  container: {
    textAlign: 'center',
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 2,
    backgroundColor: '#f7f7f7', //Toolbar background
    color: '#444',
    height: 20,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', //OS X font
    fontSize: 14,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};

export default class Titlebar extends Component {
  render() {
    const { title } = this.props;
    Window.setTitle(title);

    if (!electron) return null;

    return (
      <div style={styles.container} className="title-bar" >
        {title}
      </div>
    );
  }
}
