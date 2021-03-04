export const expirationLimit = 90;

// P.S: the key needs to be unique for this object
export const resultData = new Array(9).fill().map((value, index) => {
  return {
    key: index,
    result: [`mock result - ${index}`, 'example.lab.eng.com'],
    end: `2021-0${Math.floor(Math.random() * 6) + 1}-0${index}T11:52:34.552478`,
    deletion: `2021-0${Math.floor(Math.random() * 6) + 1}-${index + 20}T11:52:34.552478`,
    seen: false,
    saved: Math.random() < 0.5,
    status: 'published',
    description: 'More content can be added here',
  };
});

export const expiringSoonResults = new Array(10).fill().map((value, index) => {
  return {
    result: [
      `expiring-result-${index}`,
      `2021-0${Math.floor(Math.random() * 6) + 1}-0${index}T11:52:34.552478`,
    ],
  };
});
