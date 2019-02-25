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

const DeleteButton = styled(Button)`
  float: right;
`;

class RowItem extends React.Component {
  render () {
    const {
      item,
      index,
      removeItem
    } = this.props;
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided) => (
          <Container 
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {item.content}
            <DeleteButton onClick={()=>removeItem(index)} text="Remove Item"/>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default RowItem;