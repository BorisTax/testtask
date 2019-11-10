import {
  TASKS_REQUESTING,
  TASKS_RECEIVED,
  LOGIN,
  LOGOUT,
  CHANGE_DATA
} from "./actions";
const initialState = {
  tasks: [],
  taskCount: 0,
  sortField: "username",
  sortDirection: "asc",
  page: 1,
  pagesCount: 1,
  admin: false,
  requesting: false
};
export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_REQUESTING:
      return {
        ...state,
        sortField: action.payload.sortField,
        sortDirection: action.payload.sortDirection,
        page: action.payload.page,
        requesting: true
      };
    case TASKS_RECEIVED:
      return {
        ...state,
        tasks: action.payload.tasks,
        taskCount: action.payload.total_task_count,
        pagesCount: Math.ceil(action.payload.total_task_count / 3),
        requesting: false
      };
    case LOGIN:
      localStorage.setItem("token", action.payload);
      return { ...state, admin: true };
    case LOGOUT:
      localStorage.removeItem("token");
      return { ...state, admin: false };
    case CHANGE_DATA:
      const index = state.tasks.findIndex(item => item.id == action.payload.id);
      const tasks = state.tasks.slice(0);
      tasks[index].text = action.payload.text;
      tasks[index].status = action.payload.status;
      return { ...state, tasks };
    default:
  }
  return state;
}
