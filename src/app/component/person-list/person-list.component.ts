import { Component, AfterViewInit, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSelectChange, MatTabChangeEvent, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material';
import { PersonService } from '../../services/personService';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PersonResponseBean } from '../model/personResponse';
import { Person } from '../model/person';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {

  @Input() personId: number;
  @Output() editedPerson: EventEmitter<number> = new EventEmitter();

  // spinner
  color = 'primary';
  mode = 'indeterminate';
  showSpinner: boolean;

  // person response bean
  personResponseBean: PersonResponseBean;
  persons: Person[];
  person: Person;

  @ViewChild('paginatorForPersonDataSource') paginatorForPersonDataSource: MatPaginator;
  @ViewChild('sortForPersonDataSource') sortForPersonDataSource: MatSort;

  personListDataSource = new MatTableDataSource();
  displayedColumns = ['personId', 'personName', 'personCountry', 'edit_row', 'delete_row'];

  applyPersonFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.personListDataSource.filter = filterValue;
  }

  constructor(private dataService: PersonService) {
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getPersonsFromService();
  }

  ngAfterViewInit() {
    this.personListDataSource.paginator = this.paginatorForPersonDataSource;
    this.personListDataSource.sort = this.sortForPersonDataSource;
    // If the user changes the sort order, reset back to the first page.
    this.sortForPersonDataSource.sortChange.subscribe(() => this.paginatorForPersonDataSource.pageIndex = 0);
  }

  /**
   * Method to get the person list from service
   */
  getPersonsFromService() {
    this.showSpinner = true;
    this.dataService.getPersons().subscribe((personResponseBean) => {
      this.personResponseBean = personResponseBean;
      this.persons = personResponseBean.persons;
      this.personListDataSource.data = this.persons;
      this.showSpinner = false;
    });
  }

  deletePerson(row) {
    this.showSpinner = true;
    let id = this.getCurrentPersonId(row);
    this.dataService.deletePerson(id).subscribe((personResponseBean) => {
      this.personResponseBean = personResponseBean;
      this.persons = personResponseBean.persons;
      this.personListDataSource.data = this.persons;
      this.showSpinner = false;
    });
  }

  /**
   * 
   * @param row 
   */
  editPerson(row) {
    this.personId = this.getCurrentPersonId(row);
    this.editedPerson.emit(this.personId);
  }

  /**
   * Method to get the person id from the current row
   * @param row 
   */
  getCurrentPersonId(row) {
    let currentRow = row.path[4];//get the mat-row
    let id = row.path[4].children[0].textContent
    return id.trim();
  }

}
