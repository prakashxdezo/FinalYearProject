const HomeCategoryService = require("../service/HomeCategoryService");

class HomeCategeoryController {
  async createHomeCategories(req, res) {
    try {
      const homeCategories = req.body;
      console.log("Received home categories:", homeCategories); // log incoming data
      const categories =
        await HomeCategoryService.createCategories(homeCategories);
      console.log("Created categories:", categories); // log result
      return res.status(202).json(categories);
    } catch (error) {
      console.error("Error creating home categories:", error); // log error
      return res.status(500).json({ message: error.message });
    }
  }

  async getHomeCategory(req, res) {
    try {
      const categories = await HomeCategoryService.getAllHomeCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteHomeCategory(req, res) {
    try {
      await HomeCategoryService.deleteHomeCategory(req.params.id);
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateHomeCategory(req, res) {
    try {
      const id = req.params.id;
      const homeCategory = req.body;
      const updatedCategory = await HomeCategoryService.updateHomeCategory(
        homeCategory,
        id,
      );
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new HomeCategeoryController();