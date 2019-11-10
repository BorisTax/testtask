import { options } from "./config";
export const TASKS_REQUESTING = "TASKS_REQUESTING";
export const TASKS_RECEIVED = "TASKS_RECEIVED";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const EDIT_REQUEST = "EDIT_REQUEST";
export const CHANGE_DATA = "CHANGE_DATA";
export const getTasks = (sortField, sortDirection, page) => {
  return dispatch => {
    fetch(
      `${options.baseUrl}v2/?developer=Boris&sort_field=${sortField}&sort_direction=${sortDirection}&page=${page}`,
      { method: "GET" }
    )
      .then(res => res.json())
      .then(res => {
        dispatch({ type: TASKS_RECEIVED, payload: res.message });
      });
    dispatch({
      type: TASKS_REQUESTING,
      payload: { sortField, sortDirection, page }
    });
  };
};
export const login = token => {
  return { type: LOGIN, payload: token };
};
export const logout = () => {
  return { type: LOGOUT };
};
export const apply = (id, text, status) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.set("token", token);
  formData.set("text", text);
  formData.set("status", status);
  return dispatch => {
    fetch(`${options.baseUrl}v2/edit/${id}`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.status == "error") {
          dispatch({ type: LOGOUT });
        }
      });
    dispatch({ type: EDIT_REQUEST });
  };
};

export const changeData = (id, text, status) => {
  return { type: CHANGE_DATA, payload: { id, text, status } };
};
