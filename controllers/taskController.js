import Proyect from "../models/Proyect.js"
import Task from "../models/Task.js"

const addTask = async (req, res) => {
    const { proyect } = req.body
    const existsProject = await Proyect.findById(proyect)
    if (!existsProject) {
        const error = new Error("The project does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (existsProject.creator.toString() !== req.user._id.toString()) {
        const error = new Error("You do not have the permissions to add tasks")
        return res.status(403).json({ msg: error.message })
    }
    try {
        const storedTask = await Task.create(req.body)
        existsProject.tasks.push(storedTask._id)
        await existsProject.save()
        res.json(storedTask)
    } catch (error) {
        console.log(error)
    }
}

const getTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate("proyect")
    if (!task) {
        const error = new Error("The task does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (task.proyect.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Invalid action")
        return res.status(403).json({ msg: error.message })
    }
    res.json(task)
}

const updateTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate("proyect")
    if (!task) {
        const error = new Error("The task does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (task.proyect.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Invalid action")
        return res.status(403).json({ msg: error.message })
    }

    task.name = req.body.name || task.name
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.dateOfDelivery = req.body.dateOfDelivery || task.dateOfDelivery

    try {
        const taskStored = await task.save()
        res.json(taskStored)
    } catch (error) {
        console.log(error)
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate("proyect")
    if (!task) {
        const error = new Error("The task does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (task.proyect.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Invalid action")
        return res.status(403).json({ msg: error.message })
    }
    try {
        const proyect =  await Proyect.findById(task.proyect)
        proyect.tasks.pull(task._id)
        await Promise.allSettled([await proyect.save(), await task.deleteOne()])
        res.json({ msg: "Deleted task" });
    } catch (error) {
        console.log(error)
    }
}

const changeState = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate("proyect")
    if (!task) {
        const error = new Error("The task does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (task.proyect.creator.toString() !== req.user._id.toString() && !task.proyect.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
        const error = Error("Invalid action")
        return res.status(404).json({ msg: error.message });
    }
    task.state = !task.state
    task.complete =  req.user._id
    await task.save()
    const taskData = await Task.findById(id).populate("proyect").populate('complete')
    res.json(taskData)
}

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}

