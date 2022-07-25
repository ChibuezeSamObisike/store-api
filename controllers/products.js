const Product = require('../models/product');

const getAllProductsStatic = async(req, res) => {
    const search = 'emperor';

    // const products = await Product.find({
    //     name: { $regex: search, $options: 'i' },
    // });
    const products = await Product.find({}).sort('-name price');
    res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async(req, res) => {
    const { featured, company, name, sort } = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        //We are searching for this pattern, case insensitive
        queryObject.name = { $regex: name, $options: 'i' };
    }
    const result = Product.find(queryObject);
    // console.log(req.query);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        console.log(sort, sortList);
        //For multiple sort details
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };