import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MatTabChangeEvent, MatTab, MatTabHeader } from '@angular/material';
import { PersonListComponent } from './person-list.component';

import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PersonService } from '../../services/personService';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;

  let service: PersonService;
  let spy: any;
  let backend: MockBackend = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, FormsModule, RouterModule],
      declarations: [PersonListComponent, SpinnerComponent],
      providers: [PersonService, MockBackend, BaseRequestOptions, {
        provide: Http, useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => { return new Http(backendInstance, defaultOptions); },
        deps: [MockBackend, BaseRequestOptions]
      }]
    })
      .compileComponents();
  }));

  beforeEach(inject([PersonService, MockBackend], (_service: PersonService, mockBackend: MockBackend) => {
    service = _service;
    backend = mockBackend;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


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

  var personsMock = JSON.stringify({ "persons": [ { "id": 24, "name": "Aravind", "country": "India" }, { "id": 25, "name": "Rakesh", "country": "Thailand" },{ "id": 33, "name": "Barani", "country": "India" } ], "statusCode": "200", "statusMessage": "Person retrieved successfully" });
  var personMock = JSON.stringify({ "persons": [ { "id": 24, "name": "Aravind", "country": "India" } ], "statusCode": "200", "statusMessage": "Person retrieved successfully" });
  
  /**
   * verify whether getperson service is worked as expected
   */
  it('verify whether getperson service is worked as expected', (done) => {
    respondMock(personsMock, RequestMethod.Get);
    service.getPersons().subscribe((data) => {
      expect(data).toBeDefined();
      done();
    })
    component.getPersonsFromService();
    expect(component.persons.length).toBeGreaterThan(1);
  });

  /**
   * verify applyFilter functionality are working as expected
   */
  it('verify applyFilter functionality are working as expected', () => {
    component.applyPersonFilter('person');
    expect(component.personListDataSource.filter).toEqual("person");
  });


});
