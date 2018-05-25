import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MatTabChangeEvent, MatTab, MatTabHeader } from '@angular/material';

import { PersonInputComponent } from './person-input.component';
import { PersonListComponent } from '../person-list/person-list.component';
import { PersonService } from '../../services/personService';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PersonResponseBean } from '../model/personResponse';
import { Person } from '../model/person';

describe('PersonInputComponent', () => {
  let component: PersonInputComponent;
  let service: PersonService;
  let fixture: ComponentFixture<PersonInputComponent>;
  let spy: any;
  let backend: MockBackend = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, FormsModule, RouterModule],
      declarations: [PersonInputComponent, PersonListComponent, SpinnerComponent],
      providers: [PersonService, MockBackend, BaseRequestOptions, {
        provide: Http, useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => { return new Http(backendInstance, defaultOptions); },
        deps: [MockBackend, BaseRequestOptions]
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([PersonService, MockBackend], (_service: PersonService, mockBackend: MockBackend) => {
    service = _service;
    backend = mockBackend;
  }));

  /**
   * Method to handle mock response
   * @param data 
   * @param reqMethod 
   */
  function respondMock(data, reqMethod) {
    // Set the mock backend to respond with the following options:
    backend.connections.subscribe((connection: MockConnection) => {
      // Make some expectations on the request
      expect(connection.request.method).toEqual(reqMethod);
      // Decide what to return
      let options = new ResponseOptions({
        body: data
      });
      connection.mockRespond(new Response(options));
    });
  }

  var personsMock = JSON.stringify({ "persons": [{ "id": 24, "name": "Aravind", "country": "India" }, { "id": 25, "name": "Rakesh", "country": "Thailand" }, { "id": 33, "name": "Barani", "country": "India" }], "statusCode": "200", "statusMessage": "Person retrieved successfully" });
  var personMock = JSON.stringify({ "persons": [{ "id": 24, "name": "Aravind", "country": "India" }], "statusCode": "200", "statusMessage": "Person retrieved successfully" });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Person data should be saved successfully
   */
  it('person data should be saved successfully', () => {
    let personResponseBean: PersonResponseBean;
    spyOn(component, 'validatePersonInput').and.returnValue(true);
    component.addOrUpdatePerson("", "POST");
  });


  /**
   * Person data should be updated successfully
   */
  it('person data should be updated successfully', () => {
    let personResponseBean: PersonResponseBean;
    let person : Person;
    /*respondMock(personsMock, RequestMethod.Put)
    service.updatePersonInfo(person).then((data) => {
      expect(data).toBeDefined();
      done();
    }
    )*/
    spyOn(component, 'validatePersonInput').and.returnValue(true);
    component.addOrUpdatePerson("", "PUT");
  });

  /**
   * verify whether person edit handler is working as expected
   */
  it('verify whether person edit handler is worked as expected', (done) => {
    respondMock(personMock, RequestMethod.Get);
    service.getPerson('24').subscribe((data) => {
      expect(data).toBeDefined();
      done();
    })
    component.personEditedHandler(24);
    expect(component.persons.length).toEqual(1);
  });

  /**
   * verify whether the validation is working as expected
   */
  it('verify whether the validation is working as expected', () => {
    component.personNameValue = null;
    component.validatePersonInput();
    expect(component.showPersonNameError).toBeTruthy();

    component.personNameValue = '';
    component.validatePersonInput();
    expect(component.showPersonNameError).toBeTruthy();

    component.personCountryValue = null;
    component.validatePersonInput();
    expect(component.showPersonCountryError).toBeTruthy();

    component.personCountryValue = '';
    component.validatePersonInput();
    expect(component.showPersonCountryError).toBeTruthy();

  });

});
