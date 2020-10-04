import { Component, OnInit, EventEmitter, Output, Input, SimpleChange, OnChanges, OnDestroy } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Theme } from '../../shared/models/theme';
import { Observable } from 'rxjs';
import { RouterStateSnapshot } from '@angular/router';
import { ThemeDataService } from '../../shared/services/themes.service';

@Component({
  selector: 'theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit, OnDestroy {

  themes: Theme[];
  defaultTheme: Theme;

  @Output() editMessage = new EventEmitter<Theme>();
  @Input() events: Observable<void>;

  private eventsSubscription: any;

  constructor(
    private ds: DataService,
    private themeService: ThemeDataService) { }

  ngOnInit() {
    this.getAllThemes();
    this.eventsSubscription = this.events.subscribe(() => {
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  editThemeEvent(event: any, theme: Theme) {
    this.editMessage.emit(theme);
  }

  deleteThemeEvent(event: any, theme: Theme) {
    this.ds.post(DataService.getParsedEndPointTpl('api/Themes/Delete'), theme).subscribe({
      next: (data) => {
        this.getAllThemes();
      },
      error: (data) => {
        console.log('do nothing');
      }
    });
  }

  addThemeEvent(event: any) {
    this.ds.post(DataService.getParsedEndPointTpl('api/Themes/Add'), this.defaultTheme).subscribe({
      next: (data) => {
        this.getAllThemes();
      },
      error: (data) => {
        console.log('do nothing');
      }
    });
  }

  getAllThemes() {
    this.themeService.getAllThemes().subscribe({
      next: (data) => {
        this.themes = data;
        this.defaultTheme = this.themes.filter(x => {
          return (x.displayName || '').toLowerCase() === 'default';
        })[0];
        this.editMessage.emit(this.defaultTheme);
      },
      error: (data) => {
        console.log('do nothing');
      }
    });
  }
}
