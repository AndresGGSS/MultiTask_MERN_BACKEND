import {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
} from '../controllers/taskController.js'
import checkAuthorization from '../middleware/checkAuth.js'
import express from 'express'

const router = express.Router()

router.post('/',checkAuthorization,addTask)
router.route('/:id').get(checkAuthorization,getTask).put(checkAuthorization,updateTask).delete(checkAuthorization,deleteTask)
router.post('/state/:id',checkAuthorization,changeState)

export default router