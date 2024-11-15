/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import '../styles/register.scss'

const Register = () => {
    
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
      });
    const [matchPassword, setMatchPassword] = useState(true)
    const handleChange = (e) => {
        const {name, value, files} = e.target
        setFormData({
            ...formData,
            [name]: name === "profileImage" ? files[0] : value,
        })
    }
    useEffect(() => {
        setMatchPassword(formData.password === formData.confirmPassword)
    }, [formData.confirmPassword, formData.password])
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const register_form = new FormData()
            
            if(matchPassword){
                for(let key in formData) {
                    register_form.append(key, formData[key])
                }
                console.log(formData)
                const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/register`, {
                    //headers: { 'Content-Type' : 'application/json' },
                    method: 'POST',
                    body: register_form
                });
                if(response.ok) navigate("/login")
            }
            else alert("Passwords do not match")
        } catch (err) {
            console.error(err.message)
        }
    }
        
  return (
    <div className="register">
        <div className="register_content">
            <form className="register_content_form" onSubmit={handleSubmit}>
                <input type='text' placeholder="First Name" name="firstName" value={formData.firstName} 
                       onChange={handleChange} autoComplete='off' required />
                <input placeholder="Last Name" autoComplete='off' name="lastName" value={formData.lastName} 
                       onChange={handleChange} required/>
                <input placeholder="Email" name="email" type="email" value={formData.email} 
                       onChange={handleChange} autoComplete='off' required/>
                <input placeholder="Password" name="password" type="password" value={formData.password} 
                       onChange={handleChange} autoComplete='off' required/>
                <input placeholder="Confirm Password" name="confirmPassword" type="password" 
                       onChange={handleChange} autoComplete='off' value={formData.confirmPassword} required/>
                {!matchPassword && (
                    <p style={{ color: "red" }}>Passwords do not match</p>
                )}       
                <input id="image" type="file" name="profileImage" onChange={handleChange} accept="image/*" hidden required/>
                <label htmlFor="image">
                    <img src="https://ibb.co/VqsvKTm" alt="add profile photo" />
                    <p>Upload Your Photo</p>
                </label>
                {formData.profileImage && (
                    /* create url for selected image */
                    <img src={URL.createObjectURL(formData.profileImage)} alt="profile photo" style={{ maxWidth: "80px" }}/>
                )}
                <button type="submit" disabled={!matchPassword}>REGISTER</button>
            </form>
            <a href="/login">Already have an account? Log In Here</a>
        </div>
    </div>
  )
}

export default Register