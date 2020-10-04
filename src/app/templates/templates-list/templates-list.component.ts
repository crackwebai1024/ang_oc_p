import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { Format } from '@creditpoint/util';
import { SpaConfigService } from '@creditpoint/spa';

import { TemplateService } from '../shared/services/template.service';
import { Template } from '../../shared/models/template';
import { ThemeDataService } from '../../shared/services/themes.service';
import { Theme } from '../../shared/models/theme';


@Component({
  selector: 'cap-templates',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})

export class TemplatesListComponent implements OnInit {
  title = 'Templates List';
  templates: Array<Template> = [];
  themes: Array<Theme> = [];

  constructor(
    private router: Router,
    private templateService: TemplateService,
    private configService: SpaConfigService,
    private themeService: ThemeDataService) {

  }

  ngOnInit() {
    this.configService.hideAside = true;
    this.themeService.getAllThemes().subscribe({
      next: (data) => {
        this.themes = data;
        this.loadTemplates();
      }
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.loadTemplates();
  }

  private loadTemplates(): void   {
    this.templateService.getTemplates()
      .subscribe(
        data => {
          this.templates = data;
          this.templates.forEach(item => {
            item.themeName = (this.themes.filter(x => {
              return x.id === item.themeID;
            })[0] || <Theme>{}).displayName || '';
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  formatDate(data) {
    for (const record of data) {
      const date = new Date(record.modifiedDate);
      const formattedDate = Format.formatDate(date);
      record.modifiedDate = formattedDate;
    }
  }

  refreshTemplates(tempalte) {
    this.loadTemplates();
  }
}
