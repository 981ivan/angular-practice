import { Component, input, output, signal } from '@angular/core';
import { SearchFormInterface } from '../models/search-form.interface';
import { form, FormField } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolArrowReload02 } from '@ng-icons/coolicons';
import { BeforeChristPipe } from '../pipes/before-christ.pipe';

@Component({
  selector: 'app-search-form',
  imports: [FormField, NgIcon, BeforeChristPipe],
  viewProviders: [provideIcons({ coolArrowReload02 })],
  standalone: true,
  template: `
    <form (submit)="onSubmit($event)">
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-auto border p-4 m-10">
        <legend class="fieldset-legend">Search books...</legend>

        <div class="flex flex-row place-content-around">
          <input type="text" placeholder="Title" class="input" [formField]="searchForm.title" />
          <input type="text" placeholder="Author" class="input" [formField]="searchForm.author" />
        </div>

        <div class="flex flex-row place-content-around">
          <select id="language" class="select" [formField]="searchForm.language">
            <option value="">Select a language...</option>
            @for (l of allYearsAndLanguages()?.allLanguages; track $index) {
              <option [value]="l">{{ l }}</option>
            }
          </select>
          <select id="year" class="select" [formField]="searchForm.year">
            <option value="">Select a year...</option>
            @for (y of allYearsAndLanguages()?.allYears; track $index) {
              <option [value]="y">{{ y | bcPipe }}</option>
            }
          </select>
        </div>

        <div class="flex place-content-end gap-1.5">
          <button
            type="button"
            class="btn btn-warning mt-4"
            title="Reset search"
            (click)="initialSearch()"
          >
            <ng-icon name="coolArrowReload02" />
          </button>
          <button type="submit" class="btn btn-primary mt-4">Search</button>
        </div>
      </fieldset>
    </form>
  `,
  styles: ``,
})
export class SearchForm {
  formModel = signal<SearchFormInterface>({
    author: '',
    language: '',
    title: '',
    year: '',
  });

  searchForm = form(this.formModel, (schemaPath) => {});
  allYearsAndLanguages = input<{ allYears: number[]; allLanguages: string[] }>();
  search = output<SearchFormInterface>();
  cleanSearch = output();

  onSubmit(event: Event) {
    event.preventDefault();
    this.search.emit(this.formModel());
  }

  initialSearch() {
    this.formModel.set({ author: '', language: '', title: '', year: '' });
    this.cleanSearch.emit();
  }
}
