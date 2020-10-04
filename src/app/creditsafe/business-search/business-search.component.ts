import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { GridDataResult, SelectableSettings, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { SpaConfigService } from '@creditpoint/spa';
import { Util } from '@creditpoint/util';

import { CreditsafeService } from '../shared/services/creditsafe.service';

interface Business {
  companyBusinessName: string;
  companyAddress1: string;
  companyCity: string;
  companyState: string;
  companyPostalCode: string;
  creditsafeId?: string;
  companyCountry: string;
}

@Component({
  selector: 'cap-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.scss']
})
export class BusinessSearchComponent implements OnInit {
  searchComplete: boolean = false;
  gridRowSelected: boolean = false;
  selectedBusiness: Business;
  errMsg: string;
  data: any;

  pageSize = 100;
  skip = 0;
  searchResults: any;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'businessName',
      type: 'input',
      templateOptions: {
        label: 'Business Name',
        required: true
      }
    },
    {
      key: 'street',
      type: 'input',
      templateOptions: {
        label: 'Address',
      }
    },
    {
      type: 'select',
      key: 'country',
      templateOptions: {
        label: 'Country',
        options: [],
        valueProp: 'Value',
        labelProp: 'Text',
        placeholder: 'Select Country',
        required: true
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-6',
          type: 'input',
          key: 'city',
          templateOptions: {
            label: 'City',
          },
        },
        {
          className: 'col-3',
          type: 'select',
          key: 'state',
          templateOptions: {
            label: 'State / Province',
            options: [],
            valueProp: 'Value',
            labelProp: 'Text',
            placeholder: 'Select state or province',
          },
          hideExpression: 'model.country !== "US"'
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'postalCode',
          templateOptions: {
            label: 'Postal Code'
          },
        },
      ],
    }
  ];


  multiple = false;
  allowUnsort = true;
  sort: SortDescriptor[] = [{
    field: 'Business',
    dir: 'asc'
  }];
  gridView: GridDataResult;
  selectableSettings: SelectableSettings;
  templateID: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditSafeService: CreditsafeService,
    private configService: SpaConfigService) {
      if ((sessionStorage.getItem('template-id') !== null) && (sessionStorage.getItem('creditAppID') === null)) {
        this.templateID = sessionStorage.getItem('template-id');
      }

      if ((sessionStorage.getItem('template-id') === null) && (sessionStorage.getItem('creditAppID') === null)) {
        router.navigate(['/list']);
      }
  }

  ngOnInit() {
    this.data = this.route.snapshot.data;

    this.selectableSettings = {
      enabled: true,
      checkboxOnly: false,
      mode: 'single'
    };

    this.populateLookupFields();
  }

  searchCompanies() {
    this.configService.overlay = true;
    this.configService.overlayMessage = 'Searching for matching businesses...';
    this.errMsg = null;
    this.searchComplete = false;
    this.gridRowSelected = false;

    const values = this.form.getRawValue();
    this.creditSafeService.businessSearch(values).subscribe({
      next: data => {
        this.configService.overlay = false;
        this.searchComplete = true;

        if (Util.isEmpty(data)) {
          this.errMsg = 'No business matches found.';
        } else {
          this.searchResults = data;
          this.gridView = {
            data: orderBy(data, this.sort),
            total: data.length
          };
        }
      },
      error: err => {
        this.configService.overlay = false;
        this.searchComplete = true;

        this.errMsg = 'No business matches found.';
      }
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSearchResults();
  }

  loadSearchResults() {
    this.gridView = {
      data: orderBy(this.searchResults, this.sort),
      total: this.searchResults.length
    };
  }

  continue() {
    // Put selectedBusiness in storage
    localStorage.setItem('capBusiness', JSON.stringify(this.selectedBusiness));

    // Route to form entry
    this.router.navigate(['/form']);
  }

  noMatchFound() {
    // Grab form data
    const values = this.form.getRawValue();

    // Set data to selectedBusiness
    this.selectedBusiness = {
      companyBusinessName: values.businessName,
      companyAddress1: values.street,
      companyCity: values.city,
      companyState: values.state,
      companyPostalCode: values.postalCode,
      companyCountry: values.country,
      creditsafeId: null
    };

    // Put selectedBusiness in storage
    localStorage.setItem('capBusiness', JSON.stringify(this.selectedBusiness));

    // Route to form entry
    this.router.navigate(['/form']);
  }

  onSelectionChange(e) {
    this.gridRowSelected = true;

    // Grab selected row data.
    const business = e.selectedRows[0].dataItem;

    // Set data to selectedBusiness
    this.selectedBusiness = {
      companyBusinessName: business.name,
      companyAddress1: business.address.street,
      companyCity: business.address.city,
      companyState: business.address.province,
      companyPostalCode: business.address.postalCode,
      companyCountry: business.country,
      creditsafeId: business.id
    };
  }

  populateLookupFields() {
    // populate country drop down
    const countryField = this.fields.find(t => t.key === 'country');
    let us: object;
    this.data.countries = this.data.countries.filter(x => {
      if (x.Text !== 'United States') {
        return true;
      } else {
        us = x;
        return false;
      }
    });
    this.data.countries.unshift(us);

    countryField.templateOptions.options = this.data.countries;
    // populate state drop down
    const stateField = this.fields.find(t => t.fieldGroupClassName === 'row').fieldGroup.find(s => s.key === 'state');
    stateField.templateOptions.options = this.data.states;
  }
}
