import axios from 'axios'
import './css/login.css';
import React, { Fragment, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
export default function Addproject() {


    
//   const navigate = useNavigate()

  const [name, setName]= useState("")
  const [date, setDate]= useState("")


  const handleSubmit = async (e) =>{
    e.preventDefault()
    const project={
      name,
      date
    }
    try {
      
      await axios.post("http://localhost:4040/project",project).then((req,res)=>{
        if(req.data.message === "Project already exists"){
          alert("Project already exists")
        }
        if(req.data.message==="Project Created"){
          alert("Project Created")
        }
      })
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Fragment>
    <form className="projectin" method='POST'  onSubmit={handleSubmit} >
      <div className='line'>
        <h2>Add New Project</h2>
      <input type="text" value={name} placeholder='Enter Name'  onChange={(e)=>{setName(e.target.value)}} /><br />
      <input type="date" value={date} placeholder='Enter Name'  onChange={(e)=>{setDate(e.target.value)}} /><br />
      <input type="submit" value="Add Project" />
      </div>
    </form>
  </Fragment>
  )
}
