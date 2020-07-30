import { Injectable, ErrorHandler } from '@angular/core';


export class CoreErrorHandler implements ErrorHandler {

  constructor() { }

  handleError(error: any){
    console.log(error, 'deal error by errorhandler');
  }
}
