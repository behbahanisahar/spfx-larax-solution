export default interface IListItem {
  title: string;
  assignTo?: string;
  assignToId?: number;
  note: string;
  attachments?: string[];
}
