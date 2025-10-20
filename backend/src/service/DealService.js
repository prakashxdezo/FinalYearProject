const Deal = require("../model/Deal");

class DealService {
  async getDeals() {
    return await Deal.find();
  }

  async createDeals(deal) {
    try {
      const newDeal = new Deal({
        discount: deal.discount,
        category: deal.category,
      });
      return await newDeal.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDeal(deal, id) {
    const existingDeal = await Deal.findById(id);
    if (!existingDeal) throw new Error("Deal not found");

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { discount: deal.discount, category: deal.category },
      { new: true },
    );
    return updatedDeal;
  }

  async deleteDeal(id) {
    const deal = await Deal.findById(id);
    if (!deal) throw new Error("Deal not found");
    await Deal.deleteOne({ _id: id });
  }
}

module.exports = new DealService();
