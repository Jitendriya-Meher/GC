import jwt from 'jsonwebtoken';

const authUser = async ( req, res, next) => {

    try{

        const {token} = req.cookies;

        if( !token){
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        const tokenDecode = jwt.verify(
            token, process.env.JWT_SECRET
        );

        if( tokenDecode.id){

            req.userId = tokenDecode.id;

            next();

        }
        else{
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export default authUser;