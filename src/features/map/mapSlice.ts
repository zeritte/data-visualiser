import { createAsyncThunk, createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { counter, fetchMapData } from './mapAPI';

type ValueOf<T> = T[keyof T];
export const Size = {
  zero_fifty: '0-50',
  fifty_twohundred: '50-200',
  twohundred_infinity: '200-more'
};

export interface CounterState {
  rawData: any;
  data: any;
  status: 'idle' | 'loading' | 'failed';
  rampsPerMaterial: { name: string; count: number }[];
  rampsPerSize: { size: ValueOf<typeof Size>; count: number }[];
}

const initialState: CounterState = {
  rawData: null,
  data: null,
  status: 'idle',
  rampsPerMaterial: [],
  rampsPerSize: [
    { size: Size.zero_fifty, count: 0 },
    { size: Size.fifty_twohundred, count: 0 },
    { size: Size.twohundred_infinity, count: 0 }
  ]
};

export const fetchMapDataAsync = createAsyncThunk('map/fetchMapData', async () => {
  const response = await fetchMapData();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    filterOnZoom: (state, action: PayloadAction<[number, number, number, number]>) => {
      const rawData = current(state.rawData);
      const filteredData = rawData.features?.filter((t) => {
        const coordinates = t.geometry.coordinates[0][0][0];
        // only does east and west for now
        return coordinates[0] > action.payload[0] && coordinates[0] > action.payload[3];
      });
      state.data.features = filteredData;
      const [rampsPerMaterialCount, rampsPerSize] = counter(state.data);
      state.rampsPerMaterial = rampsPerMaterialCount;
      state.rampsPerSize = rampsPerSize;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMapDataAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rawData = action.payload;
        state.data = action.payload;

        const [rampsPerMaterialCount, rampsPerSize] = counter(action.payload);

        state.rampsPerMaterial = rampsPerMaterialCount;
        state.rampsPerSize = rampsPerSize;
      });
  }
});

export const { filterOnZoom } = mapSlice.actions;

export const selectMapData = (state: RootState) => state.map.data;
export const selectRampsPerMaterial = (state: RootState) => state.map.rampsPerMaterial;
export const selectRampsPerSize = (state: RootState) => state.map.rampsPerSize;

export default mapSlice.reducer;
