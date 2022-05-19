import { useState, useEffect } from 'react';
import axios from 'axios';
import useLocalStorage from 'use-local-storage';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

const Login = () => {
  const [details, setDetails] = useState([]);
  const [login, setLogin] = useState(false);
  const [token, setToken] = useLocalStorage('token', '');
  const navigate = useNavigate();
  const getUsers = async () => {
    await axios
      .get('/usersql')
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUsers();
  });
  const createUser = async (event) => {
    event.preventDefault();
    const userObject = {
      name: event.target.name.value,
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    await axios
      .post('/usersql', userObject)
      .then((res) => {
        console.log(res.data);
        alert('Registered successfully');
        getUsers();
      })
      .catch((err) => {
        alert('Registration unsuccessful. Enter unique username.');
        console.log(err);
      });
  };
  const loginForm = () => {
    setLogin(true);
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    async onSubmit(values) {
      let userObject = {
        username: values.username,
        password: values.password,
      };
      await axios
        .post(`/usersql/login`, userObject)
        .then((res) => {
          setLogin(false);
          setToken(res.data.token);
          alert('Login successful');
          navigate('/employee');
        })
        .catch((err) => {
          alert('Login failed. Enter username and password correctly.');
          console.log(err);
        });
    },
    validate() {
      const errors = {};
      if (formik.values.username.length < 3) {
        errors.username = 'Length of name must be atleast three characters';
      }
      if (formik.values.password.length < 5) {
        errors.password = 'Length of email must be atleast five characters';
      }
      return errors;
    },
  });
  return (
    <div className="container-fluid log text-center w-50">
      {login ? (
        <div>
          <h1 className="mt-3 pt-3">Log In</h1>
          <form
            className="form-group"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <label className="subHeading">Username : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="text"
              name="username"
              placeholder="Enter Username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <div className="text-danger">
              {formik.errors.username ? formik.errors.username : null}
            </div>
            <label className="subHeading">Password : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div className="text-danger">
              {formik.errors.password ? formik.errors.password : null}
            </div>
            <button className="btn btn-outline-primary">
              <b>Log In</b>
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="mt-3 pt-3">Registration</h1>
          <form className="form-group" onSubmit={createUser}>
            <label className="subHeading">Name : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="text"
              name="name"
              placeholder="Enter Name"
            />
            <br />
            <label className="subHeading">User Name : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="text"
              name="username"
              placeholder="Enter Username"
            />
            <br />
            <label className="subHeading">Email Id : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="email"
              name="email"
              placeholder="Enter Email Id"
            />
            <br />
            <label className="subHeading">Password : </label>
            <input
              className="form-control d-inline-flex w-50"
              type="password"
              name="password"
              placeholder="Enter Password"
            />
            <br />
            <button className="btn btn-outline-primary">
              <b>Register</b>
            </button>
          </form>
          <button className="btn btn-outline-primary" onClick={loginForm}>
            <b>Sign Up</b>
          </button>
        </div>
      )}
    </div>
  );
};
export default Login;
