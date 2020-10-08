import * as React from "react";
import IListViewProps from "./list-view-props";
import { sp } from "@pnp/sp";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "office-ui-fabric-react/lib/DetailsList";
import IListViewStates from "./list-view-states";
import ListItem from "./list-item";

export default class ListView extends React.Component<
  IListViewProps,
  IListViewStates
> {
  constructor(props: IListViewProps) {
    super(props);
    this.state = {
      listData: [],
    };
  }
  async componentDidMount() {
    this.getListItemData(this.props.listName);
  }

  async componentWillReceiveProps(nextProps: IListViewProps) {
    if (
      nextProps.shouldReRender ||
      this.props.listName !== nextProps.listName
    ) {
      this.getListItemData(nextProps.listName);
    }
  }
  getListItemData = async (listId: string) => {
    await sp.web.lists
      .getById(listId)
      .items.select(
        "Title",
        "Note",
        "AssignTo/Id",
        "AssignTo/Title",
        "AttachmentFiles"
      )
      .expand("AssignTo", "AttachmentFiles")
      .get()
      .then((items) => {
        this.props.onSelectIncorrectList(false);
        const listData: ListItem[] = items.map((item) => {
          const attachments: string[] = item.AttachmentFiles.map((attach) => {
            return attach.ServerRelativeUrl;
          });
          console.log(attachments);

          return {
            title: item.Title,
            note: item.Note,
            assignTo: item.AssignTo.Title,
            attachments,
          };
        });

        this.setState({ listData });
      })
      .catch(() => {
        this.setState({ listData: [] });
        this.props.onSelectIncorrectList(true);
      });
  };

  columns: IColumn[] = [
    {
      key: "column1",
      name: "Title",
      fieldName: "title",
      minWidth: 50,
      maxWidth: 130,
      isResizable: true,
    },
    {
      key: "column2",
      name: "AssignTo",
      fieldName: "assignTo",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Note",
      fieldName: "note",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column4",
      name: "Attachment File",
      fieldName: "attachments",
      minWidth: 50,
      maxWidth: 80,
      isResizable: true,
      onRender: (items: ListItem) => {
        return items.attachments.map((item, key) => {
          return (
            <div>
              <a href={item}>Attachment {key + 1}</a>
            </div>
          );
        });
      },
    },
  ];
  public render(): React.ReactElement<IListViewProps> {
    return (
      <div>
        <DetailsList
          items={this.state.listData}
          columns={this.columns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
        />
      </div>
    );
  }
}
