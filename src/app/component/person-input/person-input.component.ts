import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MaterialModule } from '../../component/material/material.module';
import { PersonService } from '../../services/personService';
import { PersonResponseBean } from '../model/personResponse';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Person } from '../model/person';
import { PersonListComponent } from '../person-list/person-list.component';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrls: ['./person-input.component.scss']
})
export class PersonInputComponent implements OnInit {

  @ViewChild(PersonListComponent)
  private personList: PersonListComponent;

  // spinner
  color = 'primary';
  mode = 'indeterminate';
  showSpinner: boolean;

  person: Person;
  showPersonId: boolean;
  personIdValue: number;
  personNameValue: string;
  personCountryValue: string;

  personResponseBean: PersonResponseBean;
  persons: Person[];

  //Validation
  showPersonNameError: boolean;
  personNameErrorMsg = "Please provide valid input for name";

  showPersonCountryError: boolean;
  personCountryErrorMsg = "Please provide valid input for country";

  // person success msg
  showServiceSuccessMsg: boolean;
  serviceSuccessMsg: string;

  // person error msg
  showServiceError: boolean;
  serviceErrorMsg: string;

  /**
   * 
   * @param dataService 
   */
  constructor(private dataService: PersonService) {
    this.showSpinner = true;
    this.showPersonId = false;
    this.hideErrorMessage();
  }

  /**
   * Lifecycle - init method
   */
  ngOnInit() {
  }

  /**
   * Method to add/update person into database via service
   * 
   * @param event 
   * @param action 
   */
  addOrUpdatePerson(event, action) {
    if (this.validatePersonInput() == true) {
      this.hideErrorMessage();
      this.showSpinner = true;
      this.person = new Person();
      this.person.id = this.personIdValue;
      this.person.country = this.personCountryValue;
      this.person.name = this.personNameValue;

      if (action == 'POST') {
        this.dataService.postPersonInfo(this.person).then((personResponseBean) => {
          this.showPersonSuccess();
        }).catch((personResponseBean) => {
          this.showSpinner = false;
          this.showPersonError("Saved");
        });
      } else {
        this.dataService.updatePersonInfo(this.person).then((personResponseBean) => {
          this.showPersonSuccess();
          this.showPersonId = false;
        }).catch((personResponseBean) => {
          this.showSpinner = false;
          this.showPersonError("Updated");
        });
      }
      this.personCountryValue = "";
      this.personNameValue = "";
    }
  }

  /**
   * Method to handle person success after service call
   */
  showPersonSuccess() {
    this.showSpinner = false;
    this.personList.getPersonsFromService();
    this.showServiceSuccessMsg = true;
    this.serviceSuccessMsg = this.personResponseBean.statusMessage.toString();
  }

  /**
   * Method to handle person error after service call
   */
  showPersonError(message: string) {
    this.showServiceError = true;
    this.serviceErrorMsg = "Person Information " + message + " successfully.";
  }

  /**
   * Handler method to get the details from person list(child) component 
   * @param personId 
   */
  personEditedHandler(personId: number) {
    this.populatePersonFromService(personId);
  }

  /**
   * Method to get the person from service for given person id and populate the input
   */
  populatePersonFromService(id) {
    this.hideErrorMessage();
    this.showSpinner = true;
    this.dataService.getPerson(id).subscribe((personResponseBean) => {
      this.personResponseBean = personResponseBean;
      this.persons = personResponseBean.persons;
      this.showPersonId = true;
      this.personCountryValue = this.persons[0].country.toString();
      this.personIdValue = this.persons[0].id;
      this.personNameValue = this.persons[0].name.toString();
      this.showSpinner = false;
    });
  }

  /**
   * To validate the drop down input
   */
  validatePersonInput() {
    var result = true;
    if (this.personNameValue == null || this.personNameValue == "") {
      this.showPersonNameError = true;
      result = false;
    } if (this.personCountryValue == null || this.personCountryValue == "") {
      this.showPersonCountryError = true;
      result = false;
    }
    return result;
  }

  /**
   * Method to hide the error message
   */
  hideErrorMessage() {
    this.showPersonNameError = false;
    this.showPersonCountryError = false;
    this.showServiceSuccessMsg = false;
    this.showServiceError = false;
  }


}
