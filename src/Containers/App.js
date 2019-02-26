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

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: {},
      itemOrder: [],
      recentlyDeleted: {},
      pinnedIndexes: [],
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
      pinnedIndexes: newData.pinnedIndexes,
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

    const itemOrderFromDrag = Array.from(this.state.itemOrder);
    itemOrderFromDrag.splice(source.index, 1);
    itemOrderFromDrag.splice(destination.index, 0, draggableId);

    const pinnedItems = this.state.pinnedIndexes.map(index => this.state.itemOrder[index])
    const newItemOrder = itemOrderFromDrag.filter(item => !pinnedItems.includes(item));
    for (let index of this.state.pinnedIndexes) {
      newItemOrder.splice(index, 0, this.state.itemOrder[index])
    }

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
        content: newItemName,
        isPinned: false,
      }
    };
    const pinnedItems = this.state.pinnedIndexes.map(index => this.state.itemOrder[index])
    const nonPinnedItems = this.state.itemOrder.filter(item => !pinnedItems.includes(item));
    const newItemOrder = Array.from(nonPinnedItems);
    newItemOrder.unshift(newItemName);

    // Splice the pinned items to create sorted array (this worked because pinned item indexes are sorted)
    for (let index of this.state.pinnedIndexes) {
      newItemOrder.splice(index, 0, this.state.itemOrder[index])
    }

    const newState = {
      ...this.state,
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: {}
    }
    this.setState(newState);
  }

  removeItem = (itemIndex) => {
    // Save data for undo
    const itemToDelete = this.state.itemOrder[itemIndex];
    const prevPinnedIndexes = Array.from(this.state.pinnedIndexes);
    const newRecentlyDeleted = {
      deletedItemIndex: itemIndex,
      deletedItemId: itemToDelete,
      deletedItemValues: this.state.items[itemToDelete],
      prevPinnedIndexes
    }
    
    const newItems = {...this.state.items};
    delete newItems[itemToDelete]

    let newPinnedIndexes = Array.from(this.state.pinnedIndexes);
    let newItemOrder = Array.from(this.state.itemOrder);
    //Removing a pinned item
    if (this.state.pinnedIndexes.includes(itemIndex)) {
      
      newPinnedIndexes.splice(newPinnedIndexes.indexOf(itemIndex), 1);
      newPinnedIndexes = newPinnedIndexes.map(index => {
        return (index > itemIndex) ? index-=1 : index;
      });

      newItemOrder.splice(itemIndex, 1);
      const newItemOrderBeforeSort = Array.from(newItemOrder);

      const pinnedItems = newPinnedIndexes.map(index => newItemOrder[index]);
      newItemOrder = newItemOrder.filter(item => !pinnedItems.includes(item));
      
      for (let index of newPinnedIndexes) {
        newItemOrder.splice(index, 0, newItemOrderBeforeSort[index])
      }
    }
    // Remove non-pinned item
    else {
      //Address edge case where pinned item's index exist beyond new list size
      if (this.state.pinnedIndexes.slice(-1)[0] >= this.state.itemOrder.length - 1){
        const pinnedItems = this.state.pinnedIndexes.map(index => this.state.itemOrder[index]);
        const nonPinnedItems = this.state.itemOrder.filter(item => !pinnedItems.includes(item));
        const lastUnpinnedIndex = this.state.itemOrder.indexOf(nonPinnedItems.slice(-1)[0]);
        newPinnedIndexes = newPinnedIndexes.map(index => (index > lastUnpinnedIndex)? index-1: index);
        newItemOrder.splice(itemIndex, 1);
        const newItemOrderBeforeSort = Array.from(newItemOrder);
        newItemOrder = newItemOrder.filter(item => !pinnedItems.includes(item));
        for (let index of newPinnedIndexes) {
          newItemOrder.splice(index, 0 , newItemOrderBeforeSort[index])
        }
      }

      newItemOrder.splice(itemIndex, 1);
      const pinnedItems = this.state.pinnedIndexes.map(index => this.state.itemOrder[index]);
      newItemOrder = newItemOrder.filter(item => !pinnedItems.includes(item));
      for (let index of newPinnedIndexes) {
        newItemOrder.splice(index, 0 , this.state.itemOrder[index])
      }
    }

    const newState = {
      ...this.state,
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: newRecentlyDeleted,
      pinnedIndexes: newPinnedIndexes
    }

    this.setState(newState);
  }

  undoMostRecentDeletion = () => {
    const {deletedItemId, deletedItemIndex, deletedItemValues, prevPinnedIndexes} = this.state.recentlyDeleted;
    const newItemOrder = Array.from(this.state.itemOrder);
    newItemOrder.splice(deletedItemIndex, 0, deletedItemId);
    const newItems = {
      ...this.state.items,
      [deletedItemId]: {
        ...deletedItemValues
      }
    }
    const newPinnedIndexes = Array.from(prevPinnedIndexes);

    const newState = {
      ...this.state,
      items: newItems,
      itemOrder: newItemOrder,
      recentlyDeleted: {},
      pinnedIndexes: newPinnedIndexes
    }
    this.setState(newState);
  }

  pinItem = (itemId, index) => {
    const newPinnedIndexes = Array.from(this.state.pinnedIndexes);
    newPinnedIndexes.push(index);
    newPinnedIndexes.sort((a, b) => a - b);
    const newItems = {
      ...this.state.items,
      [itemId]: {
        ...this.state.items[itemId],
        isPinned: true
      }
    }
    const newState = {
      ...this.state,
      items: newItems,
      recentlyDeleted: {},
      pinnedIndexes: newPinnedIndexes
    }
    this.setState(newState);
  }

  unpinItem = (itemId, index) => {
    const newPinnedIndexes = Array.from(this.state.pinnedIndexes);
    newPinnedIndexes.splice(newPinnedIndexes.indexOf(index), 1);
    const newItems = {
      ...this.state.items,
      [itemId]: {
        ...this.state.items[itemId],
        isPinned: false
      }
    };
    const newState = {
      ...this.state,
      items: newItems,
      recentlyDeleted: {},
      pinnedIndexes: newPinnedIndexes
    }
    this.setState(newState);
  }

  render() {
    const {items, itemOrder, recentlyDeleted} = this.state;
    return (
      <Container>
        <Button text="Add Item!" onClick={this.addNewItem}/> 
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <List items={items} itemOrder={itemOrder} removeItem={this.removeItem} pinItem={this.pinItem} unpinItem={this.unpinItem}/>
        </DragDropContext>
        {(Object.keys(recentlyDeleted).length !== 0) && <Button text="Restore Most Recent Deletion" onClick={this.undoMostRecentDeletion}/>}
      </Container>
    );
  }
}

export default App;
