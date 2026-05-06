test('toEqual vs toStrictEqual', () => {
  // toEqual ignores undefined properties
  expect({ a: 1 }).toEqual({ a: 1, b: undefined })

  // toStrictEqual catches them
  expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined })

  // toEqual doesn't check object types
  class User {
    name: string;

    constructor(name:string) {
      this.name = name
    }
  }
  expect(new User('Alice')).toEqual({ name: 'Alice' })
  expect(new User('Alice')).not.toStrictEqual({ name: 'Alice' })
})
