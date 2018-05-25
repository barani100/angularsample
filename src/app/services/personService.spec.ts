import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';

import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PersonService } from './personService';
import { PersonResponseBean } from '../component/model/personResponse';
import { Person } from '../component/model/person';

describe('PersonService', () => {

    let service: PersonService = null;
    let backend: MockBackend = null;

    /**
     * Configure testing module before each test case execution
     */
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [PersonService, MockBackend, BaseRequestOptions, {
                provide: Http, useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => { return new Http(backendInstance, defaultOptions); },
                deps: [MockBackend, BaseRequestOptions]
            }]
        });
    });

    /**
     * Inject service before each test case execution
     */
    beforeEach(inject([PersonService, MockBackend], (_service: PersonService, mockBackend: MockBackend) => {
        service = _service;
        backend = mockBackend;
    }));

    var personsMock = JSON.stringify({ "persons": [{ "id": 24, "name": "Aravind", "country": "India" }, { "id": 25, "name": "Rakesh", "country": "Thailand" }, { "id": 33, "name": "Barani", "country": "India" }], "statusCode": "200", "statusMessage": "Person retrieved successfully" });
    var personMock = JSON.stringify({ "persons": [{ "id": 24, "name": "Aravind", "country": "India" }], "statusCode": "200", "statusMessage": "Person retrieved successfully" });

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

    var throwMeAnError = function () {
        throw new Error();
    };

    /**
     * verify post person data service api
     */
    it('verify post person data service api', (done) => {
        let personResponseBean: PersonResponseBean;
        let person: Person;
        respondMock(personsMock, RequestMethod.Post)
        service.postPersonInfo(person).then((data) => {
            expect(data).toBeDefined();
            done();
        })
    });

    /**
     * verify update person data service api
     */
    it('verify update person data service api', (done) => {
        let personResponseBean: PersonResponseBean;
        let person: Person;
        respondMock(personsMock, RequestMethod.Put)
        service.updatePersonInfo(person).then((data) => {
            expect(data).toBeDefined();
            done();
        })
    });

    /**
     * verify delete person service api
     */
    it('verify delete person service api', (done) => {
        let personResponseBean: PersonResponseBean;
        let person: Person;
        respondMock(personsMock, RequestMethod.Delete)
        service.deletePerson("scheduled").subscribe((data) => {
            expect(data).toBeDefined();
            done();
        }
        )
    });

    /**
   * verify get list of persons service api
   */
    it('verify get list of persons service api', (done) => {
        let personResponseBean: PersonResponseBean;
        let person: Person;
        respondMock(personsMock, RequestMethod.Get)
        service.getPersons().subscribe((data) => {
            expect(data).toBeDefined();
            done();
        }
        )
    });

    /**
     * verify handle error method is throwing error as expected
     */
    it("verify handle error method is throwing error as expected", () => {
        let error = Promise.reject(true);
        service.handleError(error);
    });

    /**
     * verify handle Promise error method is throwing error as expected
     */
    it("verify handle Promise error method is throwing error as expected", () => {
        let error = Promise.reject(true);
        service.handlePromiseError(error);
        let errorResponse = Response;
        service.handlePromiseError(errorResponse);
    });

    /**
     * verify whether schedulerdata service to be created
     */
    it('SchedulerdataService should be created', inject([PersonService], (service: PersonService) => {
        expect(service).toBeTruthy();
    }));

});
