import React, { Component } from 'react';
import intialData from '../Utils/initial-data';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../Components/Column/Column';
class App extends Component {
  state = intialData;

  onDragEnd = result => {
    const { draggableId, source, destination} = result;
    console.log(result)

    // If no destination
    if (!destination) {
      return;
    }

    // If no position changes
    if (
      destination.droppableId === source.droppableID &&
      destination.index === source.index
    ) {
      return;
    }

    const column = this.state.columns['column-1'];
    const newItemIds = Array.from(column.itemIds);
    newItemIds.splice(source.index, 1);
    newItemIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      itemIds: newItemIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      }
    }

    this.setState(newState);
    //Update API
  };

  render (){
    return(
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        {this.state.columnOrder.map(columnId => {
          const column = this.state.columns[columnId];
          const items = column.itemIds.map(itemId => this.state.items[itemId]);

          return <Column key={column.id} column={column} items={items}/>
        })}
      </DragDropContext>
    )
  }
}
export default App;
