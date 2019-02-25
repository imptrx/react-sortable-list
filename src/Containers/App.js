import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import defaultData from '../Utils/defaultData';
import List from '../Components/List';
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: {},
      itemOrder: [],
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
      ...this.state,
      items: newData.items,
      itemOrder: newData.itemOrder
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
      itemOrder: newItemOrder
    }

    this.setState(newState);
  }

  render() {
    const {items, itemOrder} = this.state;
    return (
      <div className="App">
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <List items={items} itemOrder={itemOrder}/>
        </DragDropContext>
      </div>
    );
  }
}

export default App;
