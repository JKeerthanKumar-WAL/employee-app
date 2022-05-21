import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import AddEmployee from './AddEmployee';

const Employee = () => {
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [updateDepartmentId, setUpdateDepartmentId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatefile, setUpdateFile] = useState();
  const [employeeInfo, setEmployeeInfo] = useState([]);
  const [saveEmployee, setSaveEmployee] = useState();
  const [department, setDepartment] = useState([]);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [del, setDel] = useState({});
  const [defValue, setDefValue] = useState([]);
  const showUpdate = () => setModalUpdate(!modalUpdate);
  const showDelete = () => setModalDelete(!modalDelete);
  let getToken = localStorage.getItem('token');
  getToken = getToken.replace('"', '');
  getToken = getToken.replace('"', '');
  const getEmployees = async () => {
    try {
      const res = await axios.get('/employee', {
        headers: {
          token: getToken,
        },
      });
      setEmployeeInfo(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  //Departments are seeded in the backend
  const getDepartment = async () => {
    try {
      const res = await axios.get('/department', {
        headers: {
          token: getToken,
        },
      });
      setDepartment(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEmployees();
    getDepartment();
  }, []);
  const saveFile = (e) => {
    setUpdateFile(e.target.files[0]);
  };
  const editEmployee = (id) => {
    axios
      .get(`/employee/${id}`, {
        headers: {
          token: getToken,
        },
      })
      .then((res) => {
        setDefValue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setSaveEmployee(id);
    showUpdate();
  };
  const updateEmployee = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', updateName);
    formData.append('email', updateEmail);
    formData.append('image', updatefile);
    formData.append('employeeId', updateId);
    formData.append('departmentId', updateDepartmentId);
    formData.append('status', updateStatus);
    try {
      const res = await axios.put(`/employee/${saveEmployee}`, formData, {
        headers: {
          token: getToken,
        },
      });
      console.log(res.data);
      showUpdate();
      getEmployees();
      alert('Employee Details are updated.');
    } catch (err) {
      alert('Failed to update. Fill all the columns and enter a new email id');
      showUpdate();
      console.log(err);
    }
  };
  const deleteDetail = (id) => {
    setDel(id);
    showDelete();
  };
  const deleteEmployee = async () => {
    try {
      const res = await axios.delete(`/employee/${del}`, {
        headers: {
          token: getToken,
        },
      });
      showDelete();
      getEmployees();
      alert(`Employee card is deleted`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container-fluid employee">
      <AddEmployee />
      <div className="container-fluid displayInflex">
        {employeeInfo.map((val) => {
          return (
            <div className="card col-lg-3 col-md-2 col-sm-1 border">
              <img className="showImg" src={val.image} alt="Displaying Image" />
              <div className="card-body">
                <b>Name : </b>
                {val.name}
                <br />
                <b>Email Id : </b>
                {val.email}
                <br />
                <b>Employee Id : </b>
                {val.employeeId}
                <br />
                <b>Department Id : </b>
                {val.departmentId}
                <br />
                <b>Department : </b>
                {department.map((departmentVal) => {
                  if (departmentVal.id === val.departmentId) {
                    return <span>{departmentVal.department}</span>;
                  }
                })}
                <br />
                <b>Status : </b>
                {val.status}
              </div>
              <div className="card-button">
                <button
                  className="btn btn-warning m-4"
                  onClick={() => {
                    editEmployee(val.id);
                  }}
                >
                  <b>Edit</b>
                </button>
                <Modal isOpen={modalUpdate} toggle={showUpdate}>
                  <ModalHeader>Update Details</ModalHeader>
                  <ModalBody>
                    <div className="modal-update">
                      <form className="form-group">
                        <label className="subHeading">Enter Name : </label>
                        <input
                          required
                          className="form-control"
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          defaultValue={defValue.name}
                          onChange={(e) => setUpdateName(e.target.value)}
                        />
                        <br />
                        <label className="subHeading">Enter Email Id : </label>
                        <input
                          required
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Enter Email Id"
                          defaultValue={defValue.email}
                          onChange={(e) => setUpdateEmail(e.target.value)}
                        />
                        <br />
                        <label className="subHeading">Enter Image : </label>
                        <input
                          required
                          type="file"
                          accept="image/*"
                          name="image"
                          className="form-control"
                          defaultValue={defValue.image}
                          onChange={saveFile}
                        />
                        <br />
                        <label className="subHeading">
                          Enter Employee Id :
                        </label>
                        <input
                          required
                          className="form-control d-inline-flex "
                          type="text"
                          name="employeeId"
                          placeholder="Enter Employee Id"
                          defaultValue={defValue.employeeId}
                          onChange={(e) => setUpdateId(e.target.value)}
                        />
                        <br />
                        <br />
                        <label className="subHeading">
                          Enter Department Id :
                        </label>
                        <select
                          className="form-control"
                          defaultValue={defValue.departmentId}
                          onChange={(e) =>
                            setUpdateDepartmentId(e.target.value)
                          }
                        >
                          {department.map((val) => {
                            return (
                              <option value={val.id}>{val.department}</option>
                            );
                          })}
                        </select>
                        <br />
                        <label className="subHeading">Select Status : </label>
                        <select
                          className="form-control"
                          defaultValue={defValue.status}
                          onChange={(e) => setUpdateStatus(e.target.value)}
                        >
                          <option selected>{defValue.status}</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </form>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button className="btn btn-secondary" onClick={showUpdate}>
                      Close
                    </Button>
                    <Button
                      className="btn btn-success"
                      onClick={updateEmployee}
                    >
                      Update
                    </Button>
                  </ModalFooter>
                </Modal>
                <button
                  className="btn btn-danger m-4"
                  onClick={() => {
                    deleteDetail(val.id);
                  }}
                >
                  <b>Delete</b>
                </button>
                <Modal isOpen={modalDelete} toggle={showDelete}>
                  <ModalHeader>
                    Are you sure to delete the employee details ?
                  </ModalHeader>
                  <ModalFooter>
                    <Button className="btn btn-secondary" onClick={showDelete}>
                      Close
                    </Button>
                    <Button className="btn btn-danger" onClick={deleteEmployee}>
                      Delete
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Employee;
