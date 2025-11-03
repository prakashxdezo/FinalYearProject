const SellerReportService = require("../service/SellerReportService");

class SellerReportController{
    async getSellerReport(req, res){
        try{
            const seller = await req.seller; //object from middleware
            const report = await SellerReportService.getSellerReport(seller);
            res.status(200).json(report);
        }catch (error){
            res.status(400).json({error: error.message});
        }
    }
}

module.exports = new SellerReportController();