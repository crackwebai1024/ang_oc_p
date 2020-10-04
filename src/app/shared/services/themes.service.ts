import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';

@Injectable()

export class ThemeDataService {

    constructor(private ds: DataService) {}

    getAllThemes (): Observable<any>  {
        return this.ds.get(DataService.getParsedEndPointTpl('api/Themes/GetAll'));
    }

    getThemeByTemplateID (id: string): Observable<any> {
        return this.ds.get(DataService.getParsedEndPointTpl('api/Themes/GetThemeByTemplateID?id=' + id));
    }
}
