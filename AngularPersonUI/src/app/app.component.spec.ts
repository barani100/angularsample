import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from '../app/component/material/material.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PersonInputComponent } from './component/person-input/person-input.component';
import { PersonListComponent } from './component/person-list/person-list.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { PersonService } from './services/personService';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, MaterialModule, FormsModule, HttpModule
      ],
      declarations: [
        AppComponent, PersonInputComponent, SpinnerComponent, PersonListComponent
      ],
      providers: [PersonService]
    }).compileComponents();
  }));


  it(`It should have as title 'Person Details'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Person Details');
  }));

});
