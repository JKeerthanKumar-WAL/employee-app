import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [file, setFile] = useState();
  const [modalAdd, setModalAdd] = useState(false);
  const [department, setDepartment] = useState([]);
  const showAdd = () => setModalAdd(!modalAdd);
  const navigate = useNavigate();
  let getToken = localStorage.getItem('token');
  getToken = getToken.replace('"', '');
  getToken = getToken.replace('"', '');
  const getDepartment = async () => {
    await axios
      .get('/department', {
        headers: {
          token: getToken,
        },
      })
      .then((res) => {
        setDepartment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDepartment();
  });
  const saveFile = (e) => {
    setFile(e.target.files[0]);
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      employeeId: '',
      departmentId: '',
      status: '',
    },
    async onSubmit(values) {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('image', file);
      formData.append('employeeId', values.employeeId);
      formData.append('departmentId', values.departmentId);
      formData.append('status', values.status);
      await axios
        .post('/employee', formData, {
          headers: {
            token: getToken,
          },
        })
        .then((res) => {
          console.log(res.data);
          showAdd();
          navigate('/employee');
          alert('Employee Details are added');
          location.reload();
        })
        .catch((err) => {
          alert(
            'Failed to add a new employee as the email id is already exists'
          );
          showAdd();
          console.log(err);
        });
    },
    validate() {
      const errors = {};
      if (formik.values.name.length < 3) {
        errors.name = 'Length of name must be atleast three characters';
      }
      if (formik.values.email.length < 5) {
        errors.email = 'Length of email must be atleast five characters';
      }
      if (formik.values.employeeId.length < 3) {
        errors.employeeId =
          'Length of employeeId must be atleast three characters';
      }
      return errors;
    },
  });
  const clearAll = () => {
    localStorage.clear();
    alert('Logged out succesfully');
    navigate('/login');
  };

  return (
    <div className="container-fluid">
      <h1 className="row pt-3">
        <span className="col">Displaying Employees</span>
        <span className="col">
          <button className="btn btn-outline-success" onClick={showAdd}>
            Add Employee
          </button>
        </span>
        <span className="col pl-5">
          <button
            className="btn btn-outline-primary logout "
            onClick={clearAll}
          >
            <b>Log Out</b>
          </button>
        </span>
      </h1>
      <Modal isOpen={modalAdd} toggle={showAdd}>
        <ModalHeader>Add Employee Details</ModalHeader>
        <ModalBody>
          <div className="modal-body">
            <form
              className="form-group"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <label className="subHeading">Enter Name : </label>
              <input
                required
                className="form-control "
                type="text"
                name="name"
                placeholder="Enter Name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <div className="text-danger">
                {formik.errors.name ? formik.errors.name : null}
              </div>
              <br />
              <label className="subHeading">Enter Email Id : </label>
              <input
                required
                className="form-control  "
                type="email"
                name="email"
                placeholder="Enter Email Id"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <div className="text-danger">
                {formik.errors.email ? formik.errors.email : null}
              </div>
              <br />
              <label className="subHeading">Enter Image : </label>
              <input
                required
                type="file"
                accept="image/*"
                name="image"
                className="form-control "
                onChange={saveFile}
              />
              <br />
              <label className="subHeading">Enter Employee Id : </label>
              <input
                required
                className="form-control "
                type="text"
                name="employeeId"
                placeholder="Enter Employee Id"
                onChange={formik.handleChange}
                value={formik.values.employeeId}
              />
              <div className="text-danger">
                {formik.errors.employeeId ? formik.errors.employeeId : null}
              </div>
              <br />
              <label className="subHeading">Select Department : </label>
              <select
                className="form-control"
                name="departmentId"
                onChange={formik.handleChange}
                value={formik.values.departmentId}
              >
                <option selected>Select</option>
                {department.map((val) => {
                  return <option value={val.id}>{val.department}</option>;
                })}
              </select>
              <br />
              <label className="subHeading">Select Status : </label>
              <select
                className="form-control"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
              >
                <option selected> Select </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ModalFooter>
                <button className="btn btn-danger">Add</button>
              </ModalFooter>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={showAdd}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default AddEmployee;
