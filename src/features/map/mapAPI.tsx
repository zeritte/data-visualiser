import data from '../../data.json';
import { Size } from './mapSlice';

export function fetchMapData() {
  return new Promise<{ data: any }>((resolve) => setTimeout(() => resolve({ data }), 500));
}

export function counter(data) {
  const rampsPerMaterialCount = [];
  const rampsPerSize = [
    { size: Size.zero_fifty, count: 0 },
    { size: Size.fifty_twohundred, count: 0 },
    { size: Size.twohundred_infinity, count: 0 }
  ];
  for (let i = 0; i < data?.features?.length; i++) {
    const material = data.features[i].properties.material;
    const area = data.features[i].properties.area_;
    const materialIndex = rampsPerMaterialCount.findIndex((r) => r.name === material);

    if (materialIndex > -1) {
      rampsPerMaterialCount[materialIndex].count += 1;
    } else {
      rampsPerMaterialCount.push({ name: material, count: 1 });
    }

    if (area < 50) {
      rampsPerSize[0].count += 1;
    } else if (area < 200) {
      rampsPerSize[1].count += 1;
    } else {
      rampsPerSize[2].count += 1;
    }
  }

  return [rampsPerMaterialCount, rampsPerSize];
}
