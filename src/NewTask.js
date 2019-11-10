import React, { Component } from "react";
import { options } from "./config";
import "./app.css";

export default class NewTask extends Component {
  constructor(props) {
    super(props);
    this.state = { succeeded: false, message: "" };
  }
  onSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const text = document.getElementById("text").value;
    let error = false;
    let message = "";
    if (!text) {
      error = true;
      message = "Введите текст задачи";
    }
    if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      error = true;
      message = "Некорректный e-mail";
    }
    if (!username) {
      error = true;
      message = "Введите имя пользователя";
    }
    if (error) {
      this.setState({ succeeded: false, message });
      return;
    }
    let formData = new FormData();
    formData.set("username", username);
    formData.set("email", email);
    formData.set("text", text);
    fetch(`${options.baseUrl}v2/create`, { method: "POST", body: formData })
      .then(res => res.json())
      .then(res => {
        if (res.status == "ok") {
          this.setState({ succeeded: true, message: "Задача добавлена" });
          this.props.getTaskList();
        } else this.setState({ message: res.message });
      });
  }
  onChange() {
    this.setState({ message: "" });
  }
  render() {
    return (
      <div style={{ padding: "2px", margin: "5px" }}>
        <form
          style={{
            display: this.state.succeeded ? "none" : "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
          onSubmit={this.onSubmit.bind(this)}
        >
          <input
            id="username"
            placeholder="Имя пользователя"
            onChange={this.onChange.bind(this)}
          />
          <input
            id="email"
            placeholder="E-Mail"
            onChange={this.onChange.bind(this)}
          />
          <textarea
            id="text"
            placeholder="Текст задачи"
            onChange={this.onChange.bind(this)}
          />
          <div style={{ flexDirection: "row" }}>
            <input type="submit" value="Создать" />
            <input
              type="button"
              value="Отмена"
              onClick={() => this.props.cancel()}
            />
            <div>{this.state.message}</div>
          </div>
        </form>
        <div style={{ display: this.state.succeeded ? "block" : "none" }}>
          <div>{this.state.message}</div>
          <input type="button" value="OK" onClick={() => this.props.cancel()} />
          <input
            type="button"
            value="Новая задача"
            onClick={() => {
              this.setState({ succeeded: false, message: "" });
            }}
          />
        </div>
      </div>
    );
  }
}
