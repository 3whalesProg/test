const { User } = require("../../models/User");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class UserController {
  async create(req, res) {
    const { full_name, role, efficiency } = req.body;
    try {
      const user = await User.create({
        full_name,
        role,
        efficiency,
      });
      res.status(200).send({
        success: true,
        result: {
          id: user.id,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ success: false, message: "Internal" });
    }
  }

  async getCurrent(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).send({
          success: false,
          result: {
            error: "User ID is required",
          },
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({
          success: false,
          result: {
            error: "User not found",
          },
        });
      }

      res.status(200).send({
        success: true,
        result: user,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getFiltered(req, res) {
    const { full_name, role, efficiency } = req.query;
    try {
      const whereConditions = {};

      if (role) whereConditions.role = role;
      console.log(full_name)
      if (full_name) whereConditions.full_name = full_name;
      if (efficiency) whereConditions.efficiency = efficiency;

      const users = await User.findAll({ where: whereConditions });
      if (users.length === 0) {
        return res.status(404).send({
          success: false,
          result: {
            error: "No users by this filters",
          },
        });
      }
      res.status(200).send({
        success: true,
        result: {
          users: users.map((user) => ({
            id: user.id,
            full_name: user.full_name,
            role: user.role,
            efficiency: user.efficiency,
          })),
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async update(req, res) {
    const { id } = req.params;
    const { full_name, role, efficiency } = req.body;
    try {
    if (!full_name & !role & !efficiency)  { //Незачем лезть в бд если ничего не поменяется, снижаю нагрузку
        return res.status(404).send({
          success: false,
          result: {
            error: "No options selected",
          },
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({
          success: false,
          result: {
            error: "User not found",
          },
        });
      }
      
      if (full_name) user.full_name = full_name;
      if (role) user.role = role;
      if (efficiency) user.efficiency = efficiency;
      try{
        await user.save(); //заметил под конец, надо валидировать по длинне поля, и в зависимости от этого высылать ошибку
      }
      catch(e){
        console.log(e)
        return res.status(404).send({
            success: false,
            result: {
              error: "Error with save user",
            },
          });
      }

      res.status(200).send({
        success: true,
        result: {
          id: user.id,
          full_name: user.full_name,
          role: user.role,
          efficiency: user.efficiency,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async delete(req, res) {
    const {id} = req.params;
    try {
      if (id) {
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).send({
            success: false,
            result: {
              error: "User not found",
            },
          });
        }
        await user.destroy();

        return res.status(200).send({
          success: true,
          result: {
            id: user.id,
            full_name: user.full_name,
            role: user.role,
            efficiency: user.efficiency,
          },
        });
      } else {
        await User.destroy({ where: {} });
        return res.status(200).send({
          success: true,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new UserController();
