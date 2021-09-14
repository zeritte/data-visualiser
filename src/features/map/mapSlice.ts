import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchMapData } from './mapAPI';

export interface CounterState {
  data: any;
  status: 'idle' | 'loading' | 'failed';
  ramps: { [key: string]: number }[];
}

const initialState: CounterState = {
  data: null,
  status: 'idle',
  ramps: []
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
        state.ramps = action.payload?.features
          .map((feature: { properties: { material: string } }) => feature.properties.material)
          .reduce(
            (acc, curr) => ({
              count:
                acc?.filter((name) => name === curr).length > 0
                  ? ++acc?.filter((name) => name === curr)[0]
                  : 1,
              acc
            }),
            []
          );
        console.log('🚀 ~ file: mapSlice.ts ~ line 43 ~ .addCase ~ state.ramps', state.ramps);
      });
  }
});

export const {} = mapSlice.actions;

export const selectMapData = (state: RootState) => state.map.data;
export const selectRamps = (state: RootState) => state.map.ramps;

export default mapSlice.reducer;
