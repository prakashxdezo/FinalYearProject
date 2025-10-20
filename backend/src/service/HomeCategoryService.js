const HomeCategory = require("../model/HomeCategory");

class HomeCategoryService {
  async getAllHomeCategories() {
    return await HomeCategory.find();
  }

  async createHomeCategory(homeCategory) {
    return await HomeCategory.create(homeCategory);
  }

  async createCategories(homeCategories) {
    const existingCategories = await HomeCategory.find();

    if (existingCategories.length == 0) {
      return await HomeCategory.insertMany(homeCategories);
    }
    return existingCategories;
  }

  async deleteHomeCategory(id) {
    const category = await HomeCategory.findByIdAndDelete(id);
    if (!category) throw new Error("Category not found");
    return category;
  }

  async updateHomeCategory(category, id) {
    const existingCategory = await HomeCategory.findById(id);

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    return await HomeCategory.findByIdAndUpdate(
      existingCategory._id,
      category,
      { new: true },
    );
  }
}

module.exports = new HomeCategoryService();
