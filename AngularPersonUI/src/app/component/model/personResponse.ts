/**
 * PersonResponse Model class
 */
import { Person } from './person';
import { ErrorInfoBean } from './errorInfoBean';

export class PersonResponseBean {

    persons: Person[];
    errorMessages: ErrorInfoBean[];
    statusCode: String;
    statusMessage: String;

}
