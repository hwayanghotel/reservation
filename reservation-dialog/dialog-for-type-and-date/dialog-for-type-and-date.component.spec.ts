/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogForTypeAndDateComponent } from './dialog-for-type-and-date.component';

describe('DialogForTypeAndDateComponent', () => {
  let component: DialogForTypeAndDateComponent;
  let fixture: ComponentFixture<DialogForTypeAndDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogForTypeAndDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogForTypeAndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
