const HomeCategorySection = require("../domain/HomeCategorySection");
const DealService = require("./DealService");

class HomeService {
    async createHomepageDate(allCategories){
        const gridCategories = allCategories.filter(category => category.section ===HomeCategorySection.GRID);

        const shopByCategories = allCategories.filter(
          (category) => category.section === HomeCategorySection.SHOP_BY_CATEGORIES
        );

        const dealCategories = allCategories.filter(
            (category) => category.section === HomeCategorySection.DEALS
        );

        const deals = await DealService.getDeals();

        

        const home={
            grid: gridCategories,
            shopByCategories: shopByCategories,
            deals:deals,
            dealCategories:dealCategories,
        }
        return home;
    }
}
module.exports=new HomeService();