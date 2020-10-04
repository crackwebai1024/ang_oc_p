import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';

describe('AsideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
        HttpClient,
        HttpHandler,
        HttpTestingController
      ]
    });
  });

  xit('should get all fieldTypes', inject([HttpTestingController],
    (httpTestingController: HttpTestingController) => {
      const expectedFields = [
        {
          '_t': 'TextField',
          'FieldID': 1,
          'FieldName': 'businessName',
          'FieldDisplayValue': 'Business Name',
          'Required': true,
          'MinimumLength': 0,
          'MaximumLength': 50,
          'ValueType': null,
          'DefaultText': null
        }, {
          '_t': 'NumberField',
          'FieldID': 1,
          'FieldName': 'businessPhone',
          'FieldDisplayValue': 'Business Phone',
          'Required': true,
          'MinimumLength': 0,
          'MaximumLength': 50,
          'ValueType': null,
          'DefaultText': null
        }, {
          '_t': 'TextField',
          'FieldID': 1,
          'FieldName': 'businessName',
          'FieldDisplayValue': 'Business Name',
          'Required': true,
          'MinimumLength': 0,
          'MaximumLength': 50,
          'ValueType': null,
          'DefaultText': null
        }
      ];
    }));
});
