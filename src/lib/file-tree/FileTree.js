import React, { Component } from 'react';
import I from 'immutable';
import { UserFile } from '../Data';

class FolderElement extends Component {
  constructor(props) {
    super(props);
    this.state = { showChoices: false };
  }
  render() {
    const { folder, updateFolder, choices } = this.props;
    const depth = this.props.depth || 0;
    const contents = folder.get('contents').map((content, i) => {
      if (content instanceof UserFile) {
        return <FileElement key={`folder-item-${i}`} userfile={content.userfile} />;
      }
      const updateSubFolder = newFolder => {
        console.log(newFolder.toJS(), i);
        updateFolder(folder.setIn(['contents', i], newFolder))
      }
      return <FolderElement
        key={`folder-item-${i}`}
        folder={content}
        updateFolder={updateSubFolder}
        choices={choices}
        showChoices={this.state.showChoices}
        depth={depth + 1}
      />;
    });
    const addFile = file => {
      if (!folder.has('contents')) {
        return;
      }
      if (folder.get('contents').find(f => f === file)) {
        return;
      }
      updateFolder(folder.update('contents', c => c.push(file)));
    };
    const choiceElements = (
      <ul>
        {
          choices.map((choice, i) =>
            <li key={`choice-${i}`} style={{ cursor: 'pointer' }} onClick={() => addFile(choice)}>
              {choice.userfile.name}
            </li>
          )
        }
      </ul>
    );
    const addFolder = () => {
      const name = window.prompt('Please enter a folder name');
      updateFolder(folder.update('contents', c => c.push(I.fromJS({ name, contents: [] }))));
    };
    const toggleChoices = () => {
      this.setState({ showChoices: !this.state.showChoices });
    };
    return (
      <div className='folder-element'>
        <ul>
          <li>Folder: {folder.get('name')}</li>
          <ul>
            {contents}
            <li style={{ cursor: 'pointer' }} onClick={addFolder}>New Folder</li>
            <li style={{ cursor: 'pointer' }} onClick={toggleChoices}>Add a Userfile to this folder</li>
            {this.state.showChoices && choiceElements}
          </ul>
        </ul>
      </div>
    );
  }
}

const FileElement = ({ userfile }) => {
  return <li>File: {userfile.name}</li>;
}


export default ({ state, setter, }) => {
  const updateFolder = newFolder => {
    setter(state.set('root', newFolder));
  };
  return (
    <div className='file-tree'>
      <FolderElement
        folder={state.get('root')}
        updateFolder={updateFolder}
        choices={state.get('userfiles')}
      />
    </div>
  );
}
