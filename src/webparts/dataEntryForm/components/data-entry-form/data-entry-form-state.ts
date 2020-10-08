import ListItem from "./../list-view/list-item";
export default interface IDataEntryFormState {
  data: ListItem;
  selectedUsers: string[];
  disabledBtn: boolean;
}
