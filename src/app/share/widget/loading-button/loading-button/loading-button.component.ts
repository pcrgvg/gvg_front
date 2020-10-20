import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
})
export class LoadingButtonComponent implements OnInit {
  constructor() {}

  @Input() loading = false;
  @Input() color: ThemePalette = 'accent';

  ngOnInit(): void {}
}
