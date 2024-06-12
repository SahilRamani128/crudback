import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Formtable from './component/Formtable';
import TaskForm from './component/TaskForm';
import LoginForm from './component/LoginForm';
import SignupForm from './component/SignupForm';

axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [taskSection, setTaskSection] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [formDataEdit, setFormDataEdit] = useState({ name: "", email: "", mobile: "", _id: "" });
  const [taskData, setTaskData] = useState({ title: "", description: "", assignedUsers: [] });
  const [dataList, setDataList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [users, setUsers] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      setIsAuthenticated(true);
      fetchData(token);
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const usersResponse = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);
      const tasksResponse = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = (response) => {
    if (response.success) {
      alert('Signup successful! Please log in.');
      setShowSignup(false);
    } else {
      console.error('Signup response error:', response);
      alert(`Signup failed: ${response.message || 'Unknown error'}`);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
        fetchData(token);
        alert('Logged in successfully!');
        setShowLogin(false);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditOnChange = (e) => {
    const { name, value } = e.target;
    setFormDataEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskOnChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "assignedUsers") {
      const selectedUsers = Array.from(options).filter(option => option.selected).map(option => option.value);
      setTaskData((prev) => ({ ...prev, [name]: selectedUsers }));
    } else {
      setTaskData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/create", formData);
      if (response.data.success) {
        setAddSection(false);
        alert(response.data.message);
        getFetchData();
        setFormData({ name: "", email: "", mobile: "" });
      }
    } catch (error) {
      console.error("Error creating data:", error);
      alert("Failed to create data");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/tasks/create", taskData);
      if (response.data.success) {
        setTaskSection(false);
        alert(response.data.message);
        getFetchTasks();
        setTaskData({ title: "", description: "", assignedUsers: [] });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/update", formDataEdit);
      if (response.data.success) {
        getFetchData();
        alert(response.data.message);
        setEditSection(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/delete/${id}`);
      if (response.data.success) {
        getFetchData();
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data");
    }
  };

  const handleEdit = (item) => {
    setFormDataEdit(item);
    setEditSection(true);
  };

  const getFetchData = async () => {
    try {
      const response = await axios.get("/");
      if (response.data.success) {
        setDataList(response.data.data);
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      if (response.data.success) {
        setTaskList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchData(token);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    getFetchData();
    getFetchTasks();
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <button className="btn btn-add" onClick={() => setAddSection(true)}>Add User</button>
          <button className="btn btn-add" onClick={() => setTaskSection(true)}>Add Task</button>
          <button className="btn btn-add" onClick={handleLogout}>Logout</button>
          {addSection && (
            <Formtable
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
              handleclose={() => setAddSection(false)}
              rest={formData}
            />
          )}
          {editSection && (
            <Formtable
              handleSubmit={handleUpdate}
              handleOnChange={handleEditOnChange}
              handleclose={() => setEditSection(false)}
              rest={formDataEdit}
            />
          )}
          {taskSection && (
            <TaskForm
              handleSubmit={handleTaskSubmit}
              handleOnChange={handleTaskOnChange}
              handleClose={() => setTaskSection(false)}
              rest={taskData}
              users={users}
            />
          )}
          <div className="tableContainer"></div>
          <h2>Users</h2>
          <ul>
            {users?.map((user) => (
              <li key={user._id}>{user.name} - {user.email}</li>
            ))}
          </ul>
          <h2>Tasks</h2>
          <ul>
            {tasks?.map((task) => (
              <li key={task._id}>{task.title} - {task.description}</li>
            ))}
          </ul>
          <button onClick={() => setAddSection(true)}>Add User</button>
          {addSection && (
            <div>
              <h3>Add User</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input type="text" name="name" value={formData.name} onChange={handleOnChange} required />
                </label>
                <label>
                  Email:
                  <input type="email" name="email" value={formData.email} onChange={handleOnChange} required />
                </label>
                <label>
                  Mobile:
                  <input type="text" name="mobile" value={formData.mobile} onChange={handleOnChange} required />
                </label>
                <button type="submit">Add</button>
              </form>
            </div>
          )}
          {editSection && (
            <div>
              <h3>Edit User</h3>
              <form onSubmit={handleUpdate}>
                <label>
                  Name:
                  <input type="text" name="name" value={formDataEdit.name} onChange={handleEditOnChange} required />
                </label>
                <label>
                  Email:
                  <input type="email" name="email" value={formDataEdit.email} onChange={handleEditOnChange} required />
                </label>
                <label>
                  Mobile:
                  <input type="text" name="mobile" value={formDataEdit.mobile} onChange={handleEditOnChange} required />
                </label>
                <button type="submit">Update</button>
              </form>
            </div>
          )}
          {taskSection && (
            <div>
              <h3>Add Task</h3>
              <form onSubmit={handleTaskSubmit}>
                <label>
                  Title:
                  <input type="text" name="title" value={taskData.title} onChange={handleTaskOnChange} required />
                </label>
                <label>
                  Description:
                  <input type="text" name="description" value={taskData.description} onChange={handleTaskOnChange} required />
                </label>
                <label>
                  Assigned Users:
                  <select multiple name="assignedUsers" value={taskData.assignedUsers} onChange={handleTaskOnChange}>
                    {users?.map((user) => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                </label>
                <button type="submit">Add Task</button>
              </form>
            </div>
          )}
          <ul>
            {dataList.map((item) => (
              <li key={item._id}>
                {item.name} - {item.email} - {item.mobile}
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
        <div className='Home'>
          <button className = "btn btn-login" onClick={() => setShowLogin(true)}>Login</button>
          <button className = "btn btn-signup" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
        </>
      )}
      {showLogin && <LoginForm handleLogin={handleLogin} handleClose={handleCloseLogin} />}
      {showSignup && <SignupForm handleSignup={handleSignup} handleClose={handleCloseSignup} />}
    </div>
  );
}

export default App;
