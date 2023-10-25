var pool = require('../dataAccess/db')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

const register = async(req,res,next)=>{
    const { email, phone,role, password,re_password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const hashedRePass = await bcrypt.hash(re_password,salt)
    if(hashedPassword !== hashedRePass){
        return res.status(400).json({
            message:'The verification password does not match the entered password.'
        })
    }
    const checkExist = `
    SELECT COUNT(*) as count 
    FROM Users
    WHERE email = $1 or phone =$2
    `
    try {
        const result = await pool.query(checkExist, [email, phone]);
        const userCount = result.rows[0].count;
        if (userCount > 0) {
            res.status(400).json({
                message:'Email or phone already exists.'
            })
          } 
    } catch (error) {
        console.log(error)
    }
    const insertData = `
  INSERT INTO Users(email,phone,role,password,re_password)
  VALUES($1,$2,$3,$4,$5)
  RETURNING *;
  `;
  pool.query(insertData,[email,phone,role,hashedPassword,hashedRePass],(err,result)=>{
    if(err){
        console.log("Error:",err)
      }else{
        console.log("success",result.rows[0])
        res.status(200).json("Thành Công")
      }
  })
}

const login = async(req,res,next)=>{
    try {
        const { email, password } = req.body;
    
        
        const checkUserQuery = `
          SELECT id, email, password
          FROM Users
          WHERE email = $1
        `;
    
        const userResult = await pool.query(checkUserQuery, [email]);
    
        if (userResult.rows.length === 0) {
          res.status(400).json({
            message: 'User not found',
          });
          return;
        }
    
        const user = userResult.rows[0];
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res.status(401).json({
            message: 'Invalid password',
          });
          return;
        }
    
        const token = jwt.sign({ userID: user.id }, process.env.JWT_Secret, {
          expiresIn: '1h',
        });
    
        res.status(200).json({
          message: 'Login successful',
          token: token,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Internal Server Error',
        });
      }
}
const logout = async(req,res,next)=>{
    const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);

    // Remove token from blacklist or database if necessary

    // Respond with success message
    res.json({ msg: 'User logged out successfully' });
  } catch (err) {
    // Respond with error message
    res.status(500).json({ msg: 'Server error' });
  }
}
module.exports = {
    register,login,logout
}