import { Category } from "./category";
import { Purchase } from "./purchase";
import { Comment } from "./comment";

export class Product {
  id: number;
  category: Category;
  comments: Comment[];
  title: string;
  description: string;
  price: number;
  dateAdded: Date;
  imgPath: string;
}
