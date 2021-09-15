import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchMapData } from './mapAPI';

type ValueOf<T> = T[keyof T];
const Size = {
  zero_fifty: '0-50',
  fifty_twohundred: '50-200',
  twohundred_infinity: '200-more'
};

export interface CounterState {
  data: any;
  status: 'idle' | 'loading' | 'failed';
  rampsPerMaterial: { name: string; count: number }[];
  rampsPerSize: { size: ValueOf<typeof Size>; count: number }[];
}

const initialState: CounterState = {
  data: null,
  status: 'idle',
  rampsPerMaterial: [],
  rampsPerSize: [
    { size: Size.zero_fifty, count: 0 },
    { size: Size.fifty_twohundred, count: 0 },
    { size: Size.twohundred_infinity, count: 0 }
  ]
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchMapDataAsync = createAsyncThunk('map/fetchMapData', async () => {
  const response = await fetchMapData();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMapDataAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
        const rampsPerMaterialCount = [];
        const rampsPerSize = [
          { size: Size.zero_fifty, count: 0 },
          { size: Size.fifty_twohundred, count: 0 },
          { size: Size.twohundred_infinity, count: 0 }
        ];
        for (let i = 0; i < action.payload?.features?.length; i++) {
          const material = action.payload.features[i].properties.material;
          const area = action.payload.features[i].properties.area_;
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

        state.rampsPerMaterial = rampsPerMaterialCount;
        state.rampsPerSize = rampsPerSize;
      });
  }
});

export const {} = mapSlice.actions;

export const selectMapData = (state: RootState) => state.map.data;
export const selectRampsPerMaterial = (state: RootState) => state.map.rampsPerMaterial;
export const selectRampsPerSize = (state: RootState) => state.map.rampsPerSize;

export default mapSlice.reducer;
