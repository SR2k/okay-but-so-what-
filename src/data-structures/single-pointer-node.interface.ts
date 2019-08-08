export class SinglePointerNode<T> {
  constructor(
    public value: T = null,
    public next: SinglePointerNode<T> = null,
  ) {}
}
