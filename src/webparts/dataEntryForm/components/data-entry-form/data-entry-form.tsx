import * as React from "react";
import { sp } from "@pnp/sp";
import IDataEntryFormState from "./data-entry-form-state";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import IDataEntryFormProps from "./data-entry-form-props";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PrimaryButton } from "office-ui-fabric-react";
import "./data-form.css";
export default class DataEntryFormComponent extends React.Component<
  IDataEntryFormProps,
  IDataEntryFormState
> {
  constructor(props: IDataEntryFormProps) {
    super(props);
    this.state = {
      data: { title: "", note: "", assignToId: 0 },
      selectedUsers: [""],
      disabledBtn: false,
    };
  }

  onChangeFields = (value: string, fieldName: string) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          [fieldName]: value,
        },
      };
    });
  };

  setAssignTo = (items: any[]) => {
    if (items.length !== 0)
      this.setState((prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            assignToId: items[0].id,
          },
        };
      });
  };

  private addItem = async () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        disabledBtn: true,
      };
    });
    await sp.web.lists
      .getById(this.props.listName)
      .items.add({
        Title: this.state.data.title,
        Note: this.state.data.note,
        AssignToId: this.state.data.assignToId,
      })
      .then((newItem) => {
        const attachElement: any = document.getElementById("filePicker");
        const attachFile = attachElement.files[0];
        if (attachFile)
          newItem.item.attachmentFiles.add(attachFile.name, attachFile);
        this.props.shouldReRender();
        attachElement.value = "";
        this.setState((prevState) => {
          return {
            ...prevState,
            data: { title: "", note: "", assignToId: 0 },
            disabledBtn: false,
            selectedUsers: [prevState.data.assignToId + Math.random() + "user"],
          };
        });
      });
  };

  public render(): React.ReactElement<IDataEntryFormProps> {
    return (
      <div className="ms-Grid data-form" dir="ltr">
        <div className="ms-Grid-row ">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">Title :</div>
          <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
            <TextField
              value={this.state.data.title}
              onChanged={(event) => this.onChangeFields(event, "title")}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">Assign To :</div>
          <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
            <PeoplePicker
              context={this.props.context as WebPartContext}
              personSelectionLimit={1}
              groupName={""}
              showtooltip={false}
              isRequired={false}
              selectedItems={this.setAssignTo}
              showHiddenInUI={false}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000}
              ensureUser={true}
              defaultSelectedUsers={this.state.selectedUsers}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">Note :</div>
          <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
            <TextField
              value={this.state.data.note}
              onChanged={(event) => this.onChangeFields(event, "note")}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">Attachment :</div>
          <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
            <input type="file" id="filePicker" />
          </div>
        </div>
        <div className="save-btn">
          <PrimaryButton
            onClick={this.addItem}
            disabled={this.state.disabledBtn}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    );
  }
}
