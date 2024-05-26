import React from "react";
import "../App.css"
import {MdClose} from "react-icons/md"

const Formtable = ({handleSubmit,handleOnChange,handleclose,rest}) => {
    return (
        <div className="addContainer">
              <form onSubmit={handleSubmit}>
              <div className="close-btn" onClick={handleclose}><MdClose/></div>
                <lable htmlFor="name">Name : </lable>
                <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name}/>
    
                <lable htmlFor="email">Email : </lable>
                <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email}/>
    
                <lable htmlFor="mobile">Mobile No : </lable>
                <input type="number" id="mobile" name="mobile" onChange={handleOnChange} value={rest.mobile}/>
    
                <button className="btn">Submit</button>
              </form>
          </div>
    )
}

export default Formtable
