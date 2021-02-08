import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pcr-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('init')
  }

}
