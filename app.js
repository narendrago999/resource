const express = require("express")
const cors = require("cors")
const connectDB = require('./mongo.js');
const http = require("http")
const User = require("./userModel.js")
const Project = require("./projectModel.js")
const Employee = require("./employeeModel.js");
const Assigned = require("./assignModel.js");
const Billed  = require("./billableModel.js");
const { log } = require("console");
const port = 4040
app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const httpserver = http.createServer(app)
connectDB()



app.get("/getemployee", async (req,res)=>{
    const employee = await Employee.find()
    return res.send({employee})
})
app.get("/getassigned", async (req,res)=>{
    const assignedemployee = await Assigned.find()
    return res.send({assignedemployee})
})
app.get("/getbilled", async (req,res)=>{
    const billedemployee = await Billed.find()
    return res.send({billedemployee})
})







app.post("/deleteassigned/:id", async (req,res)=>{
    const { id } = req.params
    if(id!=""){
        const employee = await Assigned.findOne({_id:id})
    
        if(employee){
            const checkEmp = await Employee.findOne({name:employee.name})
            if(checkEmp){
                return res.send({message:"already billed"})
            }else{
                const emp = new Employee({name:employee.name,desc:employee.desc})
                await emp.save().then(async()=>{
                    await Assigned.findByIdAndRemove(id)
                })
                return res.send({message:"deleted",employee})
            }
        }else{
            return res.send({message:"no employee exists"})
        }
}
});
app.post("/deletebilled/:id", async (req,res)=>{
    const { id } = req.params
    if(id!=""){
        const employee = await Billed.findOne({_id:id})
    
        if(employee){
            const checkEmp = await Employee.findOne({name:employee.name})
            if(checkEmp){
                return res.send({message:"already billed"})
            }else{
                const emp = new Employee({name:employee.name,desc:employee.desc})
                await emp.save().then(async()=>{
                    await Billed.findByIdAndRemove(id)
                })
                return res.send({message:"deleted",employee})
            }
        }else{
            return res.send({message:"no employee exists"})
        }
}
});
app.post("/billed/:id", async (req,res)=>{
    const { id } = req.params
    const today = new Date()
    const project = await Project.findOne({name:"rrde"})
    const startdate = project.startDate
    if(id!=""){
    const employee = await Assigned.findOne({_id:id})
    
    if(employee){
        const checkEmp = await Billed.findOne({name:employee.name})
        if(checkEmp){
            return res.send({message:"already billed"})
        }else{
            if (today.getDate() == startdate.getDate()){
                const emp = new Billed({name:employee.name,desc:employee.desc})
                await emp.save().then(async()=>{
                    await Assigned.findByIdAndRemove(id)
                })
                return res.send({message:"billed",employee})
            }else{
                return res.send({message:"Project Not Started Yet"})
            }
        }
    }else{
        return res.send({message:"no employee exists"})
    }
}
});
app.post("/assign/:id", async (req,res)=>{
    const { id } = req.params
    const today = new Date()
    const project = await Project.findOne({name:"rrde"})
    const startdate = project.startDate
    if(id!=""){
    const employee = await Employee.findOne({_id:id})
    
    
    if(employee){
        const checkEmp = await Assigned.findOne({name:employee.name})
        if(checkEmp){
            return res.send({message:"already assigned"})
        }else{
            if (today.getDate()+7 <= startdate.getDate()){

                const emp = new Assigned({name:employee.name,desc:employee.desc})
                await emp.save().then(async()=>{
                    await Employee.findByIdAndRemove(id)
                })
                return res.send({message:"assigned",employee})
            }else{
                return res.send({message:"Start Date is less than 7"})
            }
        }
    }else{
        return res.send({message:"no employee exists"})
    }
}
});


// =============================LOGIN=========================================

app.post("/login", async (req,res)=>{
    const {email, password}=req.body
    const checkUser = await User.findOne({email})
    if(checkUser){
        if(checkUser.password===password){
            res.send({message:"login successfull", user: checkUser})
        }else{
            res.send({message:"Invalid password or email"})
        }
    }else{
        res.send({message:"User not registered, Please Register first"})
    }


})


// ========================REGISTER ====================================



app.post("/register", async (req,res)=>{
        const data = req.body
        
        if(data.name!="" && data.email != "" && data.password != ""){
        const checkEmail = await User.findOne({email:data.email})
        if(checkEmail){
            res.send({message:"email already exists try another email or login directly"})
        }else{
            const user = new User({name:data.name,email:data.email,password:data.password})
            await user.save()
            res.status(201).send({message:"User Created",user});
        }
    }
});



// =====================================PROJECT===============================



app.post("/project", async (req,res)=>{
        const data = req.body
        if(data.name!=""&& data.date!=""){
        const checkProject = await Project.findOne({name:data.name})
        if(checkProject){
            res.send({message:"Project already exists"})
        }else{
            const project = new Project({name:data.name,startDate:data.date})
            await project.save()
            res.status(201).send({message:"Project Created",project});
        }
    }
});



// ====================================EMPLOYEE==========================================



app.post("/employee", async (req,res)=>{
        const data = req.body
        
        if(data.name!="" && data.desc != ""){
        const checkEmployee = await Employee.findOne({name:data.name})
        if(checkEmployee){
            res.send({message:"Employee already exists"})
        }else{
            const employee = new Employee({name:data.name,desc:data.desc})
            await employee.save()
            res.status(201).send({message:"Employee Created",employee});
        }
    }
});

httpserver.listen(port,()=>{
    console.log(`connected at port ${port} `);
})
