import { User } from "./user";

export class Comment {
  id: number;
  productId: number;
  user: User;
  content: string;
  dateAdded: Date;
}
