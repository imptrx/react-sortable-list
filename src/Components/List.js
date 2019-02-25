import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import RowItem from './RowItem';

const Container = styled.div`
  margin: 8px;
  border: 1px solid grey;
  border-radius: 2px;
`;

const ItemList = styled.div`
  padding: 8px;
`;

class List extends React.Component {
  render() {
    const {
      items,
      itemOrder,
      maxItemsDisplay,
      removeItem,
      toggleIsPinned
    } = this.props;

    const displayItemOrder = itemOrder.slice(0, maxItemsDisplay);
    const displayItems = displayItemOrder.map(itemId => items[itemId]);

    return(
      <Container>
        <Droppable droppableId="List">
          {(provided) => (
            <ItemList
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {displayItems.map((item, index) => <RowItem key={item.id} item={item} index={index} removeItem={removeItem} toggleIsPinned={toggleIsPinned}/>)}
              {provided.placeholder}
            </ItemList>
          )}
        </Droppable>
      </Container>
    )
  }
}

List.defaultProps = {
  maxItemsDisplay: 12
}

export default List;