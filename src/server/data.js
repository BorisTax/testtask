const sortFieldSet = new Set(["username", "email", "status"]);
const taskList = [];
var id_counter = 0;
const checkAndGetQueryFields = query => {
  let sort_field = query.sort_field;
  if (!sortFieldSet.has(sort_field))
    sort_field = sortFieldSet.keys().next().value;
  let sort_direction = query.sort_direction;
  if (sort_direction !== "asc" && sort_direction !== "desc")
    sort_direction = "asc";
  let page = Math.floor(+query.page);
  if (!page || page < 0) page = 1;
  if (page > taskList.length / 3) page = Math.floor(taskList.length / 3) + 1;
  return { sort_field, sort_direction, page };
};

const getTasks = query => {
  const { sort_field, sort_direction, page } = checkAndGetQueryFields(query);
  taskList.sort((a, b) => {
    let item1 = a[sort_field];
    let item2 = b[sort_field];
    if (typeof item1 == "string") item1 = item1.toLowerCase();
    if (typeof item2 == "string") item2 = item2.toLowerCase();
    if (sort_direction === "asc") return item1 <= item2 ? -1 : 1;
    else return item1 >= item2 ? -1 : 1;
  });
  const tasks = taskList.filter(
    (item, index) => Math.ceil((index + 1) / 3) == page
  );
  return { tasks, total_task_count: taskList.length };
};

const addTask = (username, email, text) => {
  id_counter++;
  const task = {
    id: id_counter,
    username,
    email,
    text,
    status: 0,
    edited: false
  };
  taskList.push(task);
  return task;
};

const editTask = (id, text, status) => {
  const index = taskList.findIndex(item => item.id == id);
  if (index != -1) {
    if (!taskList[index].edited)
      taskList[index].edited = taskList[index].text != text;
    taskList[index].text = text;
    taskList[index].status = status;
  }
};
module.exports = { getTasks, addTask, editTask };
