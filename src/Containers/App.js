import React, { Component } from 'react';
import defaultData from '../Utils/defaultData';
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
    window.addEventListener('beforeunload', this.saveStateToStorage.bind(this));
    this.hydrateStateWithStorage()
  }

  componentWillUnmount() {
    this.saveStateToStorage()

    // Removes beforeunload listener when component gracefully unmounts
    window.removeEventListener('beforeunload', this.saveStateToStorage.bind(this));
  }

  saveStateToStorage() {
    localStorage.setItem('listData', JSON.stringify(this.state))
  }

  hydrateStateWithStorage(){
    const localStorageData = localStorage.getItem('listData')
    
    // Use predefined default state if local state is empty
    const newData = localStorageData ? JSON.parse(localStorageData) : defaultData;

    this.setState({
      ...this.state,
      items: newData.items,
      itemOrder: newData.itemOrder
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.itemOrder.map(itemId => {
          return itemId
        })}
      </div>
    );
  }
}

export default App;
