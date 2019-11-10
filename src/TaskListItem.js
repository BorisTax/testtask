import React, { Component } from "react";
import { options } from "./config";
import "./app.css";

export default class TaskListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      status: this.props.status,
      changed: false
    };
  }
  save(text = this.props.text, status = this.props.status) {
    const id = this.props.task_id;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.set("token", token);
    formData.set("text", text);
    formData.set("status", status);
    fetch(`${options.baseUrl}v2/edit/${id}`, { method: "POST", body: formData })
      .then(res => res.json())
      .then(res => {
        if (res.status == "ok") {
          this.setState({ changed: false });
        } else {
          this.props.logout();
        }
        this.props.getTaskList();
      });
  }
  checkboxPerformChange(e) {
    const status = e.target.checked ? 10 : 0;
    this.props.changeData(this.props.task_id, this.props.text, status);
    this.save(this.props.text, status);
  }
  textChange(e) {
    this.setState({ changed: true, message: "" });
    this.props.changeData(
      this.props.task_id,
      e.target.value,
      this.props.status
    );
  }
  render() {
    const performedText =
      this.props.status == 10 ? "Выполнено" : "Не выполнено";
    const statusInput = (
      <span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            id="performed"
            checked={this.props.status == 10}
            onChange={this.checkboxPerformChange.bind(this)}
          />
          <label className="performed" htmlFor="performed">
            {performedText}
          </label>
        </div>
      </span>
    );
    const textInput = (
      <textarea
        style={{minWidth:"150px"}}
        id="text"
        value={this.props.text}
        onChange={this.textChange.bind(this)}
      />
    );
    return (
      <div className="listItem">
        <div className="username">{this.props.username}</div>
        <div className="email">{this.props.email}</div>
        <div className="text">
          {this.props.admin ? textInput : this.props.text}
        </div>
        {this.props.admin ? (
          <input
            type="button"
            disabled={!this.state.changed}
            value="Сохранить"
            onClick={() => {
              this.save();
            }}
          />
        ) : (
          <div></div>
        )}
        <hr />
        <div className="status">
          {this.props.admin ? statusInput : performedText}
        </div>
        {this.props.edited ? (
          <div className="edited">Отредактировано администратором</div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
