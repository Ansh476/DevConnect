const express = require('express');
const validator = (req) => {
    const {firstName,lastName}=req.body;
    if(!(firstName || lastName)){
        throw new Error("Name is not valid");
    }
    else if(firstName.length<3){
        throw new Error("First name should be at least 3 characters long");
    }
};

const validateprofiledetails = (req) => {
    const allowedupdates = ["firstName", "lastName", "age","gender","skills","photourl","phone"];
    const isEditallowed = Object.keys(req.body).every((field)=>allowedupdates.includes(field));
    if(!isEditallowed){
        throw new Error("update not allowed");
    }
    return isEditallowed;
}
module.exports = {validator,validateprofiledetails};