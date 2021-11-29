const express = require('express');
const { Op } = require('sequelize');
const {sequelize} = require('./models');
const {User,User_ques,profile_s,Ques_user} = require('./models');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.post('/progress',async (req,res)=>{
    const {uId} = req.body
    try {
        const progress = await User.findAll({
            where:{id:uId},
            include:[profile_s]})
        if (progress) {
            res.json(progress)
        }    
        else{
            res.json({msg:"User not found"})
        }
    } catch {
        res.json({msg:"Internal server error"}).status(500)
    }
})

app.get('/ques',async (req,res)=>{
    const {userId} = req.body
    try {
        // const user = await User.findOne({
        //     where:{
        //         id:1
        //     }
        // })
        // const ques = await User_ques.findOne({
        //     where:{
        //         id:3
        //     }
        // })
        // const result = await user.addUser_ques(ques, {
        //     through: {
        //         selfGranted: false
        //     }
        // });

        const user = await User_ques.findOne({
            include:[{
                model:User,
                where:{
                    [Op.not]:[{
                        id:userId
                    }]
                },
                required:false
            }]
        })
        res.json(user.quest)
    } catch (err){
        console.log(err);
    }
})


app.post('/ques',async (req,res)=>{
    const {uId,qId,status} = req.body
    if(status === 'answered'){
        // try {
            const user = await User.findOne({
                where:{
                    id:uId
                },
                include:[profile_s]
            })
            const quest = await User_ques.findOne({
                where:{
                    id:qId
                }
            })
            const result = await user.addUser_ques(quest, {
                through: {
                    selfGranted: false
                }
            });
            if(user.profile_){
                await profile_s.update(
                    {answered:user.profile_.answered+1},
                    {
                        where:{
                            id:uId
                        }
                    }
                )
            }
            else{
                const prof = await profile_s.create({
                    userId:uId,
                    answered:1,
                    total:10
                })
            }
    //     } catch  {
    //         res.json({msg:'Internal server error'}).status(500);
    //     }
    }
})

app.listen(3000, async ()=>{
    console.log("Server started");
    await sequelize.authenticate();
    console.log("Database synced");
})