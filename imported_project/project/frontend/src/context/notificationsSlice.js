import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
    },
    setUnreadCount(state, action) {
      state.unreadCount = action.payload;
    },
  },
});

export const { setNotifications, setUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
