export const tree = [{
  name: 'A',
  parentName: null,
  description: 'This is a description of A',
  children: [
    {
      name: 'B',
      parentName: 'A',
      description: 'This is a description of B',
      children: [
        {
          name: 'B-1',
          parentName: 'B',
          description: 'This is a description of B-1',
          children: [],
        },
        {
          name: 'B-2',
          parentName: 'B',
          description: 'This is a description of B-2',
          children: [],
        },
        {
          name: 'B-3',
          parentName: 'B',
          description: 'This is a description of B-3',
          children: [],
        },
      ],
    },
    {
      name: 'C',
      parentName: 'A',
      description: 'This is a description of C',
      children: [],
    },
    {
      name: 'D',
      parentName: 'A',
      description: 'This is a description of D',
      children: [],
    },
  ],
}] as const
