import {
  create,
  deleteDoc,
  findOne,
  findMany,
  update,
} from '../../Repositories/genericRepository';
import successHandler from '../../libs/routes/successHandler';
import { userResponse } from '../../Constants/constants';
import { userModel } from '../../Model';
import getExistingUser from './utils';


const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userFound, userNotFound } = userResponse;
    const result = await findOne(userModel, id);
    if (!result) {
      const err = new Error(userNotFound);
      err.status = 404;
      next(err);
    }
    res
      .status(200)
      .send(successHandler(userFound, result));
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { foundAllUsers } = userResponse;
    const result = await findMany(userModel);
    res
      .status(200)
      .send(successHandler(foundAllUsers, result));
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { userCreated, userAlreadyExists } = userResponse;
    const user = await getExistingUser(userModel, email);
    if (user) {
      const error = new Error(userAlreadyExists);
      error.status = 400;
      return next(error);
    }
    const result = await create(userModel, { name, email, password });
    return res
      .status(201)
      .send(successHandler(userCreated, result));
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userDeleted } = userResponse;
    const result = await deleteDoc(userModel, id);

    res
      .status(200)
      .send(successHandler(userDeleted, result));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, dataToUpdate } = req.body;
    const { userUpdated } = userResponse;
    const result = await update(userModel, id, dataToUpdate);

    res
      .status(200)
      .send(successHandler(userUpdated, result));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { invalidPassword, userDoesNotExists } = userResponse;
    const user = await getExistingUser(userModel, email, password);
    if (!user) {
      const error = new Error(userDoesNotExists);
      error.status = 400;
      return next(error);
    }
    if (user && !user.validPassword(password)) {
      const error = new Error(invalidPassword);
      error.status = 400;
      return next(error);
    }
    return res
      .status(200)
      .send(successHandler('Successfully logged in', user));
  } catch (error) {
    return next(error);
  }
};

export {
  getUser,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  login,
};
