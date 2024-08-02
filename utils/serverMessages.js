const handleError = ((res, error, status) => { 
    console.log(error)
    res.status(status ? status : 500).send(error)
})

const handleSuccessMessage = ((res, message) =>
    res.status(200).json({
        success: true,
        message
    })
)

module.exports = {
    handleError,
    handleSuccessMessage
}