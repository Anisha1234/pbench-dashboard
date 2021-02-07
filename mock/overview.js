export const expirationLimit = 90;

// P.S: the key needs to be unique for this object
export const resultData = [
  {
    key: 1,
    result: ['mock result -1', 'example.lab.eng.com'],
    end: '2020-09-10T 11:52:34.552478',
    deletion: '2020-10-10T11:52:34.552478',
    seen: false,
    description: 'More content can be added here',
  },
  {
    key: 2,
    result: ['mock result -2', ' example.lab.eng.com'],
    end: '2020-10-10T11:52:34.552478',
    deletion: '2020-11-10T11:52:34.552478',
    seen: false,
    description: 'More content can be added here',
  },
  {
    key: 3,
    result: ['mock result -3', ' example.lab.eng.com'],
    end: '2020-11-10T11:52:34.552478',
    deletion: '2020-12-10T11:52:34.552478',
    seen: false,
    description: 'More content can be added here',
  },
  {
    key: 4,
    result: ['mock result -4', ' example.lab.eng.com'],
    end: '2020-11-10T11:52:34.552478',
    deletion: '2020-12-13T11:52:34.552478',
    seen: false,
    description: 'More content can be added here',
  },
  {
    key: 5,
    result: ['mock result -5', 'example.lab.eng.com'],
    end: '2020-12-10T11:52:34.552478',
    deletion: '2021-02-10T11:52:34.552478',
    seen: true,
    description: 'More content can be added here',
  },
  {
    key: 6,
    result: ['mock result -6', ' example.lab.eng.com'],
    end: '2020-12-10T11:52:34.552478',
    deletion: '2021-03-10T11:52:34.552478',
    seen: true,
    description: 'More content can be added here',
  },
  {
    key: 7,
    result: ['mock result -7', ' example.lab.eng.com'],
    end: '2021-01-10T11:52:34.552478',
    deletion: '2021-04-10T11:52:34.552478',
    seen: true,
    description: 'More content can be added here',
  },
  {
    key: 8,
    result: ['mock result -8', ' example.lab.eng.com'],
    end: '2021-01-10T11:52:34.552478',
    deletion: '2021-03-10T11:52:34.552478',
    seen: true,
    description: 'More content can be added here',
  },
  {
    key: 9,
    result: ['mock result -9', ' example.lab.eng.com'],
    end: '2021-01-20T11:52:34.552478',
    deletion: '2021-04-20T11:52:34.552478',
    seen: true,
    description: 'More content can be added here',
  },
];

export const expiringSoonResults = {
  'mock-result-1': '2020-09-10T 11:52:34:552478',
  'mock-result-2': '2020-09-10T 11:52:34:552478',
  'mock-result-3': '2020-09-10T 11:52:34:552478',
  'mock-result-4': '2020-09-10T 11:52:34:552478',
  'mock-result-5': '2020-09-10T 11:52:34:552478',
  'mock-result-6': '2020-09-10T 11:52:34:552478',
  'mock-result-7': '2020-09-10T 11:52:34:552478',
  'mock-result-8': '2020-09-10T 11:52:34:552478',
};
