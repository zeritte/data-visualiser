import data from '../../data.json';

export function fetchMapData() {
  return new Promise<{ data: any }>((resolve) => setTimeout(() => resolve({ data }), 500));
}
