import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import ReactPaginate from 'react-paginate';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import AddEmployee from './AddEmployee';

const Employee = () => {
  const [updateFile, setUpdateFile] = useState();
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
  const [pageNumber, setPageNumber] = useState(0);
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
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      image: '',
      employeeId: '',
      departmentId: '',
      status: '',
    },
    async onSubmit(values) {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('image', updateFile);
      formData.append('employeeId', values.employeeId);
      formData.append('departmentId', values.departmentId);
      formData.append('status', values.status);
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
        alert(
          'Failed to update. Fill all the columns and enter a new email id'
        );
        showUpdate();
        console.log(err);
      }
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
  const employeesPerPage = 3;
  const pagesVisited = pageNumber * employeesPerPage;
  const displayEmployees = employeeInfo
    .slice(pagesVisited, pagesVisited + employeesPerPage)
    .map((employee) => {
      return (
        <div className="card col-lg-3 col-md-2 col-sm-1 border displayInflex">
          <img
            className="showImg"
            src={employee.image}
            alt="Displaying Image"
          />
          <div className="card-body">
            <b>Name : </b>
            {employee.name}
            <br />
            <b>Email Id : </b>
            {employee.email}
            <br />
            <b>Employee Id : </b>
            {employee.employeeId}
            <br />
            <b>Department Id : </b>
            {employee.departmentId}
            <br />
            <b>Department : </b>
            {department.map((departmentVal) => {
              if (departmentVal.id === employee.departmentId) {
                return <span>{departmentVal.department}</span>;
              }
            })}
            <br />
            <b>Status : </b>
            {employee.status}
          </div>
          <div className="card-button">
            <button
              className="btn btn-warning m-4"
              onClick={() => {
                editEmployee(employee.id);
              }}
            >
              <b>Edit</b>
            </button>
            <Modal isOpen={modalUpdate} toggle={showUpdate}>
              <ModalHeader>Update Details</ModalHeader>
              <ModalBody>
                <div className="modal-update">
                  <form
                    className="form-group"
                    onSubmit={formik.handleSubmit}
                    noValidate
                  >
                    <label className="subHeading">Enter Name : </label>
                    <input
                      required
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      defaultValue={defValue.name}
                      onChange={formik.handleChange}
                    />
                    <div className="text-danger">
                      {formik.errors.name ? formik.errors.name : null}
                    </div>
                    <br />
                    <label className="subHeading">Enter Email Id : </label>
                    <input
                      required
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Enter Email Id"
                      defaultValue={defValue.email}
                      onChange={formik.handleChange}
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
                      className="form-control"
                      defaultValue={defValue.image}
                      onChange={saveFile}
                    />
                    <br />
                    <label className="subHeading">Enter Employee Id :</label>
                    <input
                      required
                      className="form-control d-inline-flex "
                      type="text"
                      name="employeeId"
                      placeholder="Enter Employee Id"
                      defaultValue={defValue.employeeId}
                      onChange={formik.handleChange}
                    />
                    <div className="text-danger">
                      {formik.errors.employeeId
                        ? formik.errors.employeeId
                        : null}
                    </div>
                    <br />
                    <label className="subHeading">Enter Department Id :</label>
                    <select
                      className="form-control"
                      defaultValue={defValue.departmentId}
                      name="departmentId"
                      onChange={formik.handleChange}
                    >
                      {department.map((val) => {
                        return <option value={val.id}>{val.department}</option>;
                      })}
                    </select>
                    <br />
                    <label className="subHeading">Select Status : </label>
                    <select
                      className="form-control"
                      defaultValue={defValue.status}
                      name="status"
                      onChange={formik.handleChange}
                    >
                      <option selected>{defValue.status}</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ModalFooter>
                      <button className="btn btn-success" type="submit">
                        Update
                      </button>
                    </ModalFooter>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="btn btn-secondary" onClick={showUpdate}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
            <button
              className="btn btn-danger m-4"
              onClick={() => {
                deleteDetail(employee.id);
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
    });
  const pageCount = Math.ceil(employeeInfo.length / employeesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <div className="container-fluid employee">
      <AddEmployee />
      {displayEmployees}
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'paginationBttns'}
        previousLinkClassName={'previousBttn'}
        nextLinkClassName={'nextBttn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
    </div>
  );
};
export default Employee;
