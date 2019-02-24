const intialData = {
  items: {
    "item-1": {id: "item-1", content: "item-1"},
    "item-2": {id: "item-2", content: "item-2"},
    "item-3": {id: "item-3", content: "item-3"},
    "item-4": {id: "item-4", content: "item-4"},
    "item-5": {id: "item-5", content: "item-5"},
    "item-6": {id: "item-6", content: "item-6"},
  },
  columns: {
    'column-1': {
      id: "column-1",
      title: "to do",
      itemIds: ["item-1","item-2","item-3","item-4","item-5","item-6"]
    }
  },
  columnOrder: ["column-1"]
}

export default intialData;