export interface KeyValuePair { 
    id: number; 
    name: string; 
  }
  
  export interface ToDo {
    id: number; 
    priority: KeyValuePair;
    name: string;
    done: boolean;
  }
  
  export interface SaveToDo {
    id: number; 
    priorityId: number;
    name: string;
    done: boolean;
  }