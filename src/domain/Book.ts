export class Book {
  constructor(
    public readonly id: number,
    public readonly isbn: string,
    public readonly title: string,
    public readonly author: string,
    public readonly category: string,
    public readonly totalCopies: number,
    public readonly availableCopies: number,
    public readonly publishedYear?: number
  ) {}

  isAvailable() {
    return this.availableCopies > 0;
  }
}
