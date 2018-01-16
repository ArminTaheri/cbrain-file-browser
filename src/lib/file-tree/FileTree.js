import React from 'react';

const FolderElement = ({ contents }) =>
 ''

const FileElement = ({ userfile }) =>
  ''


export default ({ setter, state }) => {
  return (
    <div className='file-tree'>
      {JSON.stringify(state.get('root'))}
    </div>
  );
}
