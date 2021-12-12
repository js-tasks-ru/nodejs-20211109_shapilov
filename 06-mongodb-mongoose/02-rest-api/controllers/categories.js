const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesModels = await Category.find({});

  let categories = [];

  categoriesModels.forEach((category) => categories.push(mapCategory(category)));

  ctx.body = {categories};
};
