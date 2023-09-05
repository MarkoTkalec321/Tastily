export interface Item{
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  category_id: number;
  image?:File;
  imageMimeType:string;
}
