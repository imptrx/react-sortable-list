import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import ListItem from '../ListItem/ListItem';

const Container = styled.div`
  margin: 8px;
  border: 1px solid grey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const ItemList =styled.div`
  padding: 8px;
`;

export default class Column extends React.Component {
  render() {
    return(
      <Container>
        <Title>
          {this.props.column.title}
        </Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided) => (
            <ItemList
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.items.map((item, index) => <ListItem key={item.id} item={item} index={index} />)}
              {provided.placeholder}
            </ItemList>
          )} 
        </Droppable> 
      </Container>
    )
  }
}