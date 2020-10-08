import * as React from "react";
import styles from "./DataEntryForm.module.scss";
import { IDataEntryFormProps } from "./IDataEntryFormProps";
import ListView from "./list-view/list-view";
import DataEntryFormComponent from "./data-entry-form/data-entry-form";
import { IDataEntryFormStates } from "./IDataEntryFormStates";
export default class DataEntryForm extends React.Component<
  IDataEntryFormProps,
  IDataEntryFormStates
> {
  constructor(props: IDataEntryFormProps) {
    super(props);
    console.log(this.props.listName);
    this.state = {
      shouldRender: false,
      isIncorrectList: false,
    };
  }
  async componentDidMount() {}

  componentWillReceiveProps(nextProps: IDataEntryFormProps) {
    if (nextProps.listName !== this.props.listName) {
      this.setState({ isIncorrectList: false });
    }
  }
  reRenderList = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        shouldRender: true,
      };
    });
  };
  onSelectIncorrectList = (value: boolean) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isIncorrectList: value,
      };
    });
  };
  public render(): React.ReactElement<IDataEntryFormProps> {
    return (
      <div className={styles.dataEntryForm}>
        {this.state.isIncorrectList && (
          <div style={{ margin: "auto", fontWeight: "bold", color: "red" }}>
            {" "}
            Please Select Correct List !{" "}
          </div>
        )}
        {!this.state.isIncorrectList && (
          <div>
            <ListView
              listName={this.props.listName}
              shouldReRender={this.state.shouldRender}
              onSelectIncorrectList={this.onSelectIncorrectList}
            />
            <DataEntryFormComponent
              listName={this.props.listName}
              context={this.props.context}
              shouldReRender={this.reRenderList}
            />
          </div>
        )}
      </div>
    );
  }
}
