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
    // TODO: save result to state
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
