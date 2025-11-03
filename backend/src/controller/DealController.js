const DealService = require("../service/DealService");

class DealController{

    async getAllDeals(req, res){
        try {
            const deals = await DealService.getDeals();
            return res.status(200).json(deals);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async createDeals(req, res){
        try {
            const deal = req.body;
            const createDeal = await DealService.createDeals(deal);
            return res.status(201).json({createDeal});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async updateDeal(req, res){
        const {id}= req.params;
        const deal = req.body;
        try {
            const updateDeal = await DealService.updateDeal(deal, id);
            return res.status(200).json(updateDeal);
        } catch (error) {
            return res.status(404).json({error: error.message});
        }
    }

    async deleteDeals(req, res){
        const { id } = req.params;
        try {
            await DealService.deleteDeal(id);
             return res.status(202).json({message: "Deal deleted successfully"});

        } catch (error) {
            return res.status(404).json({error: error.message});

        }
    }
}

module.exports = new DealController();