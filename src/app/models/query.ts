export type Query = {
  page: number;
  elementsPerPage: number;
  sortBy: string;
  title: string;
  author: string;
  year?: number;
  language: string;
}
