import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "./actions";
import { options } from "./config";
import "./app.css";

class Login extends Component {
  constructor() {
    super();
    this.state = { error: false };
  }
  onSubmit(e) {
    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    fetch(`${options.baseUrl}v2/login`, { method: "POST", body: formData })
      .then(res => res.json())
      .then(res => {
        if (res.status === "ok") {
          this.props.login(res.token);
          this.setState({ error: false });
        } else {
          this.setState({ error: true });
        }
      });
    this.setState({ error: false });
    e.preventDefault();
  }
  render() {
    const error = this.state.error ? (
      <span className="failLogin">Неправильные логин или пароль</span>
    ) : (
      <span></span>
    );
    return (
      <form className="loginForm" onSubmit={this.onSubmit.bind(this)}>
        <input
          id="name"
          placeholder="логин"
          required
          onChange={() => this.setState({ error: false })}
        />
        <input
          id="password"
          placeholder="пароль"
          required
          type="password"
          onChange={() => this.setState({ error: false })}
        />
        <input type="submit" value="Вход" />
        <br />
        {error}
      </form>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  login: token => dispatch(login(token))
});
export default connect(
  null,
  mapDispatchToProps
)(Login);
