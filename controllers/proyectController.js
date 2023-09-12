import Proyect from "../models/Proyect.js"
import User from "../models/User.js"

const getProyects = async (req, res) => {
    const proyects = await Proyect.find({
        '$or' : [
            {'collaborators' : {$in: req.user}},
            {'creator' : {$in: req.user}},
        ]
    }).select("-tasks")
    res.json(proyects)
}

const newProyects = async (req, res) => {
    const proyect = new Proyect(req.body)
    proyect.creator = req.user._id
    try {
        const storedProject = await proyect.save()
        return res.json(storedProject)
    } catch (error) {
        console.error(error); 
    }
}


const getProyect = async (req, res) => {
    const { id } = req.params;
    const proyect = await Proyect.findById(id).populate({path: 'tasks', populate: {path: 'complete', select: 'name'}}).populate('collaborators', 'name email');
    if (!proyect) {
        const error = Error("Not found")
        return res.status(404).json({ msg: error.message });
    }
    if (proyect.creator.toString() !== req.user._id.toString() && !proyect.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
        const error = Error("Invalid action")
        return res.status(404).json({ msg: error.message });
    }
    res.json(proyect)
};


const editProyect = async (req, res) => {
    const { id } = req.params;
    const proyect = await Proyect.findById(id);
    if (!proyect) {
        const error = Error("Not found")
        return res.status(404).json({ msg: error.message });
    }
    if (proyect.creator.toString() !== req.user._id.toString()) {
        const error = Error("Invalid action")
        return res.status(404).json({ msg: error.message });
    }

    proyect.name = req.body.name || proyect.name
    proyect.description = req.body.description || proyect.description
    proyect.dateOfDelivery = req.body.dateOfDelivery || proyect.dateOfDelivery
    proyect.client = req.body.client || proyect.client

    try {
        const storedProject = await proyect.save()
        res.json(storedProject)
    } catch (error) {
        console.log(error)
    }
}

const deleteProyect = async (req, res) => {
    const { id } = req.params;
    const proyect = await Proyect.findById(id);
    if (!proyect) {
        const error = Error("Not found")
        return res.status(404).json({ msg: error.message });
    }
    if (proyect.creator.toString() !== req.user._id.toString()) {
        const error = Error("Invalid action")
        return res.status(404).json({ msg: error.message });
    }

    try {
        await proyect.deleteOne()
        res.json({ msg: "Deleted project" });
    } catch (error) {
        console.log(error)
    }
}

const searchCollaborator = async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email}).select('-confirm -createdAt -password -token -updatedAt -__v')
    if(!user){
        const error = new Error('User not found')
        return res.status(404).json({msg: error.message})
    }
    res.json(user)
}

const addCollaborator = async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email}).select('-confirm -createdAt -password -token -updatedAt -__v')
    const proyect = await Proyect.findById(req.params.id)
    if(!proyect){
        const error = new Error('Project not found')
        return res.status(404).json({msg: error.message})
    }
    if(proyect.creator.toString() !== req.user._id.toString()){
        const error = new Error('Invalid action')
        return res.status(404).json({msg: error.message}) 
    }
    if(!user){
        const error = new Error('User not found')
        return res.status(404).json({msg: error.message})
    }
    if(proyect.creator.toString() === user._id.toString()){
        const error = new Error('The project creator cannot be a collaborator')
        return res.status(404).json({msg: error.message})
    }
    if(proyect.collaborators.includes(user._id)){
        const error = new Error('The user already belongs to the project')
        return res.status(404).json({msg: error.message})
    }
    proyect.collaborators.push(user._id)
    await proyect.save()
    res.json({msg:'Contributor added successfully'})
}

const deleteCollaborator = async (req, res) => {
    const proyect = await Proyect.findById(req.params.id)
    if(!proyect){
        const error = new Error('Project not found')
        return res.status(404).json({msg: error.message})
    }
    if(proyect.creator.toString() !== req.user._id.toString()){
        const error = new Error('Invalid action')
        return res.status(404).json({msg: error.message}) 
    }
    proyect.collaborators.pull(req.body.id)
    await proyect.save()
    res.json({msg:'Contributor successfully removed'})
}

export {
    getProyect,
    getProyects,
    newProyects,
    editProyect,
    deleteProyect,
    deleteCollaborator,
    addCollaborator,
    searchCollaborator
};
