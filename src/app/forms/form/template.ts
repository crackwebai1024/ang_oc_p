export const template: string = `
{
  "creditAppID": null,
  "clientID": "fb1",
  "customerID": null,
  "customerName": null,
  "templateName": "test template",
  "status": null,
  "createdDate": "0001-01-01T00:00:00",
  "createdByUserName": null,
  "createdByUserFullName": null,
  "steps": [
    {
      "stepID": 1,
      "stepName": "Step 1",
      "stepDisplayName": "Step 1",
      "sections": [
        {
          "sectionID": 1,
          "sectionName": "Section1",
          "displayName": "Section 1",
          "fields": [
            {
              "value": null,
              "fieldType": "TextBox",
              "required": false,
              "minimumLength": 0,
              "maximumLength": 50,
              "valueType": null,
              "placeHolderText": null,
              "fieldID": 1,
              "fieldName": "TestText1",
              "fieldDisplayValue": "Textbox 1"
            },
            {
              "fieldType": "Text",
              "fieldID": 2,
              "fieldName": "StaticText1",
              "fieldDisplayValue": "Testing some static text"
            },
            {
              "fieldType": "FieldGroup",
              "multipleItems": true,
              "minimumItems": 0,
              "maximumItems": 0,
              "fields": [
                {
                  "value": null,
                  "fieldType": "TextBox",
                  "required": false,
                  "minimumLength": 0,
                  "maximumLength": 50,
                  "valueType": null,
                  "placeHolderText": "FG Text Box Placeholder",
                  "fieldID": 11,
                  "fieldName": "FGTextBox",
                  "fieldDisplayValue": "FG Text Box"
                }
              ],
              "fieldID": 3,
              "fieldName": "FieldGroup1",
              "fieldDisplayValue": "Field Group 1"
            }
          ]
        }
      ]
    },
    {
      "stepID": 2,
      "stepName": "Step 2",
      "stepDisplayName": "Step 2",
      "sections": [
        {
          "sectionID": 2,
          "sectionName": "Section2",
          "displayName": null,
          "fields": [
            {
              "value": null,
              "fieldType": "TextBox",
              "required": true,
              "minimumLength": 0,
              "maximumLength": 50,
              "valueType": null,
              "placeHolderText": null,
              "fieldID": 3,
              "fieldName": "TestText2",
              "fieldDisplayValue": "Textbox 2"
            },
            {
              "value": null,
              "fieldType": "Date",
              "required": true,
              "minimumDate": "2018-03-01T23:28:56.782Z",
              "maximumDate": "2018-03-01T23:28:56.782Z",
              "fieldID": 4,
              "fieldName": "datefield1",
              "fieldDisplayValue": "Date Field"
            },
            {
              "value": null,
              "fieldType": "Dropdown",
              "listName": "States",
              "fieldID": 5,
              "fieldName": "State",
              "fieldDisplayValue": "State"
            }
          ]
        }
      ]
    }
  ],
  "dropdownLists": [
    {
      "items": [
        {
          "text": "Oklahoma",
          "value": "OK"
        },
        {
          "text": "Texas",
          "value": "TX"
        }
      ],
      "name": "States",
      "dataType": "string"
    }
  ]
}
`;
