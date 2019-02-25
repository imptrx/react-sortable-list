import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Button from './Button';

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

const RowButton = styled(Button)`
  float: right;
  margin: 0 0 0 8px;
`;

const PinnedText = styled.strong`
  float: right;
  color: red;
`;

class RowItem extends React.Component {
  render () {
    const {
      item,
      index,
      removeItem,
      toggleIsPinned
    } = this.props;
    return (
      <Draggable draggableId={item.id} index={index} isDragDisabled={item.isPinned}>
        {(provided) => (
          <Container 
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {item.content}
            <RowButton onClick={()=>removeItem(index)} text="Remove Item"/>
            {!item.isPinned && <RowButton onClick={()=>toggleIsPinned(item.id)} text="Pin Item"/>}
            {item.isPinned && <RowButton onClick={()=>toggleIsPinned(item.id)} text="Unpin Item"/>}
            {item.isPinned && <PinnedText>Pinned</PinnedText>}
          </Container>
        )}
      </Draggable>
    )
  }
}

export default RowItem;