import { WebPartContext } from "@microsoft/sp-webpart-base";
export default interface IDataEntryFormProps {
  context: WebPartContext;
  listName: string;
  shouldReRender: () => void;
}
