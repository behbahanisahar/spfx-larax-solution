import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
} from "@microsoft/sp-webpart-base";

import * as strings from "DataEntryFormWebPartStrings";
import DataEntryForm from "./components/DataEntryForm";
import { IDataEntryFormProps } from "./components/IDataEntryFormProps";
import { sp } from "@pnp/sp";
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
export interface IDataEntryFormWebPartProps {
  listName: string;
}

export default class DataEntryFormWebPart extends BaseClientSideWebPart<
  IDataEntryFormWebPartProps
> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be present

      sp.setup({
        spfxContext: this.context,
      });
    });
  }

  public async render(): Promise<void> {
    const element: React.ReactElement<IDataEntryFormProps> = React.createElement(
      DataEntryForm,
      {
        listName: this.properties.listName,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneListName,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // PropertyPaneTextField("listName", {
                //   label: strings.ListNameFieldLabel,
                // }),
                PropertyFieldListPicker("listName", {
                  label: "Select a list",
                  selectedList: this.properties.listName,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
