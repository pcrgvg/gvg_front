import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubBtnComponent } from './github-btn/github-btn.component';



@NgModule({
  declarations: [
    GithubBtnComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GithubBtnComponent]
})
export class GithubBtnModule { }
