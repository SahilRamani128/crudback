import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdClose } from 'react-icons/md';

const TaskForm = ({ handleSubmit, handleOnChange, handleClose, rest, users }) => (
  <div className="form-container">
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={rest.title} onChange={handleOnChange} />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={rest.description} onChange={handleOnChange} />
      </label>
      <label>
        Assigned Users:
        <select name="assignedUsers" multiple value={rest.assignedUsers} onChange={handleOnChange}>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleClose}>Close</button>
    </form>
  </div>
);

export default TaskForm;

