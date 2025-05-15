const adminValidate = require("../../adminRoutes/validate");

const admin_auth = async ( req , res ) => {
    try {        
        const token = req.body.token;
        const isAdmin = await adminValidate(token);
        console.log(isAdmin);
        if(!isAdmin) return res.status(403).send("false")
        res.status(200).send("true")    
    } catch (error) {
        console.log("auth error :",error);
        res.status(500).send("false")
    }
}

module.exports = {
    admin_auth,
}
