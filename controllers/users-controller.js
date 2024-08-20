const User = require("../models/user")

const {
    handleError
} = require("../utils/serverMessages")

const getUsers = (async (req, res) => {
    console.log('users params', req.query)
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const search = req.query.search || ''
    const is_verified = req.query.is_verified
    const sorting = { [req.query.sort_field || 'createdAt']: +req.query.sort_direction || -1 }
    console.log('sorting', sorting)
    const startIndex = (page - 1) * per_page;

    const searchOptions = {}
    if (search) {
        const separatorIndex = search.indexOf(' ')
        searchOptions.$or = [
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            {
                $and: [
                    { first_name: { $regex: search.slice(0, separatorIndex), $options: 'i' } },
                    { last_name: { $regex: search.slice(separatorIndex + 1), $options: 'i' } },
                ]
            }
        ]
    }

    if (is_verified) searchOptions.is_verified = is_verified
    console.log('searchOptions', searchOptions)

    const total = await User.countDocuments(searchOptions);

    User
        .find(searchOptions)
        .skip(startIndex)
        .limit(per_page)
        .sort(sorting)
        .then((data) => {
            res.status(200).json({
                total,
                data
            })
        })
        .catch((error) => handleError(res, error))
})

const getUserById = ((req, res) => {
    User
        .findById(req.params.id)
        .then((user) => res.status(200).json(user))
        .catch((error) => handleError(res, error))
})

module.exports = {
    getUsers,
    getUserById
}