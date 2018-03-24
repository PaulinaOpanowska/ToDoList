import { Component, OnInit } from '@angular/core';
import { KeyValuePair } from '../../models/ToDo';
import { ToDoService } from '../../services/to-do.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly PAGE_SIZE = 15; 

  queryResult: any = {};
  priorities: KeyValuePair[];
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  columns = [
    { title: 'Name', key: 'name', isSortable: true },
    { title: 'Done', key: 'done', isSortable: true },
    { title: 'Priority', key: 'priority', isSortable: true },
    { }
  ];

  constructor(private todoService: ToDoService) { }

  ngOnInit() { 
    this.todoService.getPriorities()
      .subscribe(p => this.priorities = p);

    this.populateToDos();
  }

  private populateToDos() {
    this.todoService.getToDos(this.query)
      .subscribe(result => this.queryResult = result);
  }

  onFilterChange() {
    this.query.page = 1; 
    this.populateToDos();
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    this.populateToDos();
  }

  sortBy(columnName) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending; 
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateToDos();
  }

  onPageChange(page) {
    this.query.page = page; 
    this.populateToDos();
  }

  DeleteToDo(id){
    if (confirm("Are you sure?")) {
      this.todoService.delete(id)
        .subscribe(x => {
          this.populateToDos();
        });
    }
  }
}
