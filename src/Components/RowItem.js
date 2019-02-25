import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

class RowItem extends React.Component {
  render () {
    const {
      item,
      index
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
          </Container>
        )}
      </Draggable>
    )
  }
}

export default RowItem;