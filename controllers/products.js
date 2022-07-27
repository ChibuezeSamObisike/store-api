const Product = require('../models/product');

const getAllProductsStatic = async(req, res) => {
    const search = 'emperor';

    // const products = await Product.find({
    //     name: { $regex: search, $options: 'i' },
    // });
    // const products = await Product.find({}).sort('-name price');
    //Skip and Limit are for pagination functionality
    const products = await Product.find({ price: { $gt: 30 } })
        .select('name price')
        .sort('price')
        .limit(4)
        .skip(2);
    res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async(req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
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
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((i) => {
            const [field, operator, value] = items.split('-');
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value) };
            }
        });
    }
    let result = Product.find(queryObject);
    // console.log(req.query);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        console.log(sort, sortList);
        //For multiple sort details
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result.select(fieldList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //For pagination
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };