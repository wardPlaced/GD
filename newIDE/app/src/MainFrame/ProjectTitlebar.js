import React, { Component } from 'react';
import Titlebar from '../UI/Titlebar';

export default class ProjectTitlebar extends Component {
  render() {
    const { project } = this.props;
    const titleElements = ['GDevelop'];
    if (project) titleElements.push(project.getProjectFile() || project.getName());

    return <Titlebar title={titleElements.join(' - ')} />;
  }
}
