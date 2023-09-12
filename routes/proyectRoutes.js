import {
    getProyect,
    getProyects,
    newProyects,
    editProyect,
    deleteProyect,
    deleteCollaborator,
    searchCollaborator,
    addCollaborator
} from "../controllers/proyectController.js";
import checkAuthorization from "../middleware/checkAuth.js";
import express from "express";

const router = express.Router();

router.route('/').get(checkAuthorization, getProyects).post(checkAuthorization, newProyects);
router.route('/:id').get(checkAuthorization, getProyect).put(checkAuthorization, editProyect).delete(checkAuthorization, deleteProyect);
router.post('/collaborator', checkAuthorization, searchCollaborator)
router.post('/collaborator/:id', checkAuthorization, addCollaborator);
router.post('/delete-collaborator/:id', checkAuthorization, deleteCollaborator);

export default router;
