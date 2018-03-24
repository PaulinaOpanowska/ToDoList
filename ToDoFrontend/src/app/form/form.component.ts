import { SaveToDo, ToDo } from './../../models/ToDo';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoService } from '../../services/to-do.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  priorities: any[] = [];
  todo: SaveToDo = {
    id: 0,
    priorityId: 0,
    name: '',
    done: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: ToDoService,
    private toastyService: ToastyService) {

      route.params.subscribe(p => {
        this.todo.id = +p['id'] || 0;
      });
    }

  ngOnInit() {
    var sources = [
      this.todoService.getPriorities(),
    ];

    if (this.todo.id)
      sources.push(this.todoService.getToDo(this.todo.id));

    Observable.forkJoin(sources).subscribe(data => {
      this.priorities = data[0];

      if (this.todo.id) {
        this.setToDo(data[1]);
        //this.populateModels();
      }
    }, err => {
      if (err.status == 404)
        this.router.navigate(['/home']);
    });
  }

  private populateModels() {
    var selectedPriority = this.priorities.find(m => m.id == this.todo.priorityId);
  }

  private setToDo(v: any) {
    this.todo.id = v.id;
    this.todo.priorityId = v.priority.id;
    this.todo.done = v.done;
    this.todo.name = v.name;
  } 

  submit() {
    var result$ = (this.todo.id) ? this.todoService.update(this.todo) : this.todoService.create(this.todo); 
    result$.subscribe(todo => {
      this.toastyService.success({
        title: 'Success', 
        msg: 'Data was sucessfully saved.',
        theme: 'bootstrap',
        showClose: true,
        timeout: 5000
      });
      console.log('Data was sucessfully saved.');
      this.router.navigate(['/home'])
    });
  }
}
