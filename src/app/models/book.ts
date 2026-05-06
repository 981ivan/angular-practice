export class Book {
  constructor(
    public author: string,
    public country: string,
    public language: string,
    public webLink: string,
    public pages: number,
    public title: string,
    public year: number,
    public id?: number,
  ) {}
}
