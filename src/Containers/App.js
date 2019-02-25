import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import defaultData from '../Utils/defaultData';
import List from '../Components/List';
import Button from '../Components/Button';

const Container = styled.div`
  padding: 8px;
  width: 100%;
`;

const AddButton = styled(Button)``;

const UndoButton = styled(Button)``;

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: {},
      itemOrder: [],
      recentlyDeleted: {}
    };
  }

  componentDidMount() {
    // Preserves state to Storage API on site refresh or exit
    window.addEventListener('beforeunload', this.saveStateToStorage);
    this.hydrateStateWithStorage()
  }

  componentWillUnmount() {
    this.saveStateToStorage()

    // Removes beforeunload listener when component gracefully unmounts
    window.removeEventListener('beforeunload', this.saveStateToStorage);
  }

  saveStateToStorage = () => {
    localStorage.setItem('listData', JSON.stringify(this.state))
  }

  hydrateStateWithStorage = () => {
    const localStorageData = localStorage.getItem('listData')
    
    // Use predefined default state if local state is empty
    const newData = localStorageData ? JSON.parse(localStorageData) : defaultData;

    this.setState({
      items: newData.items,
      itemOrder: newData.itemOrder,
      recentlyDeleted: {},
    });
  }

  onDragEnd = result => {
    const { draggableId, source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newItemOrder = Array.from(this.state.itemOrder);
    newItemOrder.splice(source.index, 1);
    newItemOrder.splice(destination.index, 0, draggableId);

    const newState = {
      ...this.state,
      itemOrder: newItemOrder,
      recentlyDeleted: {}
    }

    this.setState(newState);
  }

  addNewItem = () => {
    const newItemName = `Item_${this.state.itemOrder.length+1}_(${new Date().toLocaleTimeString()})`;
    const newItems = {
      ...this.state.items,
      [newItemName]: {
        id: newItemName,
        content: newItemName
      }
    };
    const newItemOrder = Array.from(this.state.itemOrder);
    newItemOrder.unshift(newItemName);
    const newState = {
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: {},
    }
    this.setState(newState);
  }

  removeItem = (itemIndex) => {
    const itemToDelete = this.state.itemOrder[itemIndex];
    const newRecentlyDeleted = {
      deletedItemIndex: itemIndex,
      deletedItemId: itemToDelete,
      deletedItemContent: this.state.items[itemToDelete].content
    }
    const newItems = {...this.state.items};
    delete newItems[itemToDelete]
    const newItemOrder = Array.from(this.state.itemOrder);
    newItemOrder.splice(itemIndex, 1);

    const newState = {
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: newRecentlyDeleted
    }
    this.setState(newState);
  }

  undoMostRecentDeletion = () => {
    const {deletedItemId, deletedItemIndex, deletedItemContent} = this.state.recentlyDeleted;
    const newItemOrder = Array.from(this.state.itemOrder);
    newItemOrder.splice(deletedItemIndex, 0, deletedItemId);
    const newItems = {
      ...this.state.items,
      [deletedItemId]: {
        id: deletedItemId,
        content: deletedItemContent
      }
    }
    const newState = {
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: {}
    }
    this.setState(newState);
  }

  render() {
    const {items, itemOrder, recentlyDeleted} = this.state;
    return (
      <Container>
        <AddButton text="Add Item!" onClick={this.addNewItem}/> 
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <List items={items} itemOrder={itemOrder} removeItem={this.removeItem}/>
        </DragDropContext>
        {(Object.keys(recentlyDeleted).length !== 0) && <UndoButton text="Restore Most Recent Deletion" onClick={this.undoMostRecentDeletion}/>}
      </Container>
    );
  }
}

export default App;
