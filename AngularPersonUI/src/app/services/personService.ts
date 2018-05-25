import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { PersonResponseBean } from '../component/model/personResponse';
import { Person, persons } from '../component/model/person';
import { environment } from '../../environments/environment';

/**
* Get the api url from corresponding environment.ts
*/
const PERSON_API_URL = environment.personServiceUrl;
/**
 * Service class to perform CRUD operations for person details 
 */
@Injectable()
export class PersonService {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    personResponseBean = new PersonResponseBean();
    personList: any;
    constructor(public http: Http) {
        this.personList = persons;
    }

    /**
     * Method to get the list of persons from service in json format
     */
    public getPersons() {
        return this.http.get(PERSON_API_URL + 'getpersons').map(res => res.json()).catch(this.handlePromiseError);
    }

    /**
    * Method to get the person in json format
    */
    public getPerson(id: String) {
        return this.http.get(PERSON_API_URL + 'getperson?id=' + id).
            map(res => res.json()).catch(this.handlePromiseError);

    }

    /**
    * Method to delete the person 
    */
    public deletePerson(id: String) {
        return this.http.delete(PERSON_API_URL + 'deleteperson?id=' + id).
            map(res => res.json()).catch(this.handlePromiseError);
    }

    /**
     * Method to post the person data to service 
     * 
     * @param person 
     */
    public postPersonInfo(person: Person): Promise<Person> {
        return this.http
            .post(PERSON_API_URL + 'addperson', JSON.stringify(person), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Person)
            .catch(this.handleError);
    }

    /**
     * Method to update the person data to service 
     * 
     * @param person 
     */
    public updatePersonInfo(person: Person): Promise<Person> {
        return this.http
            .put(PERSON_API_URL + 'updateperson', JSON.stringify(person), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Person)
            .catch(this.handleError);
    }

    /**
     * Method to handle the error during service call
     * @param error 
     */
    handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    /**
     * Method to handle promise error 
     * @param error 
     */
    handlePromiseError(error) {
        let errorMessage: String;
        if (error instanceof Response) {
            let body = error.json() || '';
            let err = body.err || JSON.stringify(body);
        } else {
            errorMessage = error.message ? error.message : error.toString();
        }
        return Observable.throw(errorMessage);
    }

}