import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() model: any;
  @Input() fGroup: FormGroup;
  @Input() fControl: FormControl;
  searching = false;
  searchFailed = false;
  formatter = (result: string) => result.toLowerCase();
  constructor(private http: HttpClient) { }

  search: OperatorFunction<any, any> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.http.get('assets/data/colors.json').pipe(
          tap(() => this.searchFailed = false),
          map(data => data['colors'].filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
          map(colors => colors.map(color => color.name)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

  selectColor(event) {
    const val = event.item;
    this.model = val;
    this.fControl.patchValue(val)
  }
  ngOnInit(): void {
  }

}
