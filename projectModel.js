const mongoose = require("mongoose")


const projectSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    startDate:{
        type:Date,
    }
})

const Project = mongoose.model("Project",projectSchema)

module.exports = Project