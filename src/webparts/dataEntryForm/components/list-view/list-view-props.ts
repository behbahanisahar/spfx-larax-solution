export default interface IListViewProps {
  listName: string;
  shouldReRender: boolean;
  onSelectIncorrectList: (value: boolean) => void;
}
