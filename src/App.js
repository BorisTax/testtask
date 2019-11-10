import React, { Component } from "react";
import { connect } from "react-redux";
import { getTasks, login, logout, changeData } from "./actions";
import TaskListItem from "./TaskListItem";
import NewTask from "./NewTask";
import Login from "./Login";
import "./app.css";

class App extends Component {
  constructor() {
    super();
    this.state = { newTask: false };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) this.props.login(token);
    this.getTaskList();
  }
  getTaskList() {
    this.props.getTasks(
      this.props.sortField,
      this.props.sortDirection,
      this.props.page
    );
  }
  pageClick(page) {
    this.props.getTasks(this.props.sortField, this.props.sortDirection, page);
  }
  render() {
    const user = this.props.admin ? "Администратор" : "";
    const tasks = this.props.tasks.map((item, index) => (
      <TaskListItem
        key={index}
        admin={this.props.admin}
        logout={this.props.logout}
        changeData={this.props.changeData}
        getTaskList={this.getTaskList.bind(this)}
        task_id={item.id}
        username={item.username}
        email={item.email}
        text={item.text}
        edited={item.edited}
        status={item.status}
      />
    ));
    const pages = [];
    for (let i = 1; i <= this.props.pagesCount; i++)
      pages.push(
        <a
          style={{
            margin: "2px",
            color: i == this.props.page ? "red" : "black"
          }}
          href="#"
          key={i}
          onClick={e => {
            this.pageClick(i);
            e.preventDefault();
          }}
        >
          {i}
        </a>
      );
    return (
      <div>
        <div className="header">
          <span className="admin">{user}</span>
          {this.props.admin ? (
            <input
              type="button"
              value="Выход"
              onClick={() => {
                this.props.logout();
              }}
            />
          ) : (
            <Login />
          )}
        </div>
        {this.state.newTask ? (
          <NewTask
            cancel={() => {
              this.setState({ newTask: false });
            }}
            getTaskList={this.getTaskList.bind(this)}
          />
        ) : (
          <input
            type="button"
            value="Новая задача"
            onClick={() => {
              this.setState({ newTask: true });
            }}
          />
        )}
        <br />
        <div className="sort">
          <span style={{ padding: "5px" }}>Сортировать по</span>
          <select
            onChange={e => {
              this.props.getTasks(
                e.target.value,
                this.props.sortDirection,
                this.props.page
              );
            }}
          >
            <option value="username">Имя пользователя</option>
            <option value="email">E-Mail</option>
            <option value="status">Статус</option>
          </select>
          <select
            onChange={e => {
              this.props.getTasks(
                this.props.sortField,
                e.target.value,
                this.props.page
              );
            }}
          >
            <option value="asc">по возрастанию</option>
            <option value="desc">по убыванию</option>
          </select>
        </div>
        {tasks.length > 0 ? (
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tasks}
            </div>
            {this.props.pagesCount > 1 ? (
              <div>Страницы {pages}</div>
            ) : (
              <div></div>
            )}
          </div>
        ) : (
          <div>Нет задач</div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
function mapDispatchToProps(dispatch) {
  return {
    getTasks: (sortField, sortDirection, page) =>
      dispatch(getTasks(sortField, sortDirection, page)),
    logout: () => dispatch(logout()),
    login: token => dispatch(login(token)),
    changeData: (id, text, status) => dispatch(changeData(id, text, status))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
