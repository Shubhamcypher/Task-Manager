const authenticateToken = require('./auth.route')

const router = require("express").Router();

const Task =  require("../models/task.model");
const User = require("../models/user.model");

//create task
router.post('/create-task',authenticateToken,async(req,res)=>{
    try {
        const {title, description,due} = req.body
        const {id} = req.headers
        const newTask = new Task({title:title, description:description,due:due})
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id,{$push:{tasks:taskId._id}});
        res
        .status(200)
        .json({message:'Task created successfully'})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error creating task" });
    }
})

//get all tasks
router.get('/get-all-tasks',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers
        const userData = await User.findById(id).populate({ path:'tasks', options:{sort:{createdAt:-1}} })
        res
        .status(200)
        .json({data:userData})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error getting all tasks" });
    }
})

//get important tasks
router.get('/get-important-tasks',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers
        const data = await User.findById(id).populate({
        path:'tasks',
        match:{important:true},
        options:{sort:{createdAt:-1}} })
        const importantTaskData = data.tasks
        res
        .status(200)
        .json({data:importantTaskData})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error getting important tasks" });
    }
})

//get completed tasks
router.get('/get-completed-tasks',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers
        const data = await User.findById(id).populate({
        path:'tasks',
        match:{completed:true},
        options:{sort:{createdAt:-1}} })
        const completedTaskData = data.tasks
        res
        .status(200)
        .json({data:completedTaskData})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error getting completed tasks" });
    }
})

//get incomplete tasks
router.get('/get-incomplete-tasks',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers
        const data = await User.findById(id).populate({
        path:'tasks',
        match:{completed:false},
        options:{sort:{createdAt:-1}} })
        const completedTaskData = data.tasks
        res
        .status(200)
        .json({data:completedTaskData})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error getting completed tasks" });
    }
})

//delete task
router.delete('/delete-task/:id',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params
        const userId = req.headers.id
        await Task.findByIdAndDelete(id)
        await User.findByIdAndUpdate(userId, {$pull : { tasks : id } } )
        res
        .status(200)
        .json({message:'Task deleted successfully'})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error deleting task" });
    }
})

//update task
router.put('/update-task/:id',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params
        const {title, description,due} = req.body
        await Task.findByIdAndUpdate(id,{title,description,due})
        res
        .status(200)
        .json({message:'Task updated successfully'})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error updating task" });
    }
})

//update important task
router.patch('/update-important-task/:id',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params
        const TaskData = await Task.findById(id)
        const ImportantTask = TaskData.important
        await Task.findByIdAndUpdate(id,{important:!ImportantTask})
        res
        .status(200)
        .json({message:'Task updated successfully'})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error updating task" });
    }
})

//update completed task
router.patch('/update-completed-task/:id',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params
        const TaskData = await Task.findById(id)
        const CompletedTask = TaskData.completed
        await Task.findByIdAndUpdate(id,{completed:!CompletedTask})
        res
        .status(200)
        .json({message:'Task updated successfully'})
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error updating task" });
    }
})


module.exports = router;