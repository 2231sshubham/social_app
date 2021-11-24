const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Op } = require("sequelize");
const {sequelize} = require('./models');
const {User,Mutual} = require('./models');

// Promise for mutuals
async function RB(friend1, friend2) {
    let count=0;
    let usr1 = null,
        usr2 = null;
    let rb = await Mutual.findAll({
        where: {
            requested_by: friend1,
            status: "accepted"
        }
    })
    await rb.forEach(async (element) => {
        let usr1 = await Mutual.findOne({
            where: {
                requested_by: element.requested_to,
                requested_to: friend2,
                status: "accepted"
            }
        })
        if (!usr1) {
            usr2 = await Mutual.findOne({
                where: {
                    requested_to: element.requested_to,
                    requested_by: friend2,
                    status: "accepted"
                }
            })
        }
        if (usr2 || usr1) {
            count++;
            // console.log("I too get executed", count);
        }
    });
    return count;
}

async function RT(friend1,friend2){
    let count=0;
    let rt = await Mutual.findAll({
        where: {
            requested_to: friend1,
            status: "accepted"
        }
    })
    let usr1 = null
    let usr2 = null
    await rt.forEach(async (element) => {
        let usr1 = await Mutual.findOne({
            where: {
                requested_by: element.requested_by,
                requested_to: friend2,
                status: "accepted"
            }
        })
        if (!usr1) {
            usr2 = await Mutual.findOne({
                where: {
                    requested_to: element.requested_by,
                    requested_by: friend2,
                    status: "accepted"
                }
            })
        }
        if (usr2 || usr1) {
            count++;
        }
    });
    return count;
}

async function mutualCount(friend1,friend2){
    let count = 0;
    count += await RB(friend1, friend2)
    count += await RT(friend1, friend2)
    return count
};

app.use(express.json());
app.use(express.urlencoded({
    extended : false
}));

app.get('/',(req,res)=>{
    res.send("WORKING!");
})

app.get('/logout:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const active = awaitUuserMupdate({active:false},{
            where:{
            UuserMame:id
            }
        })
    } catch {
        res.json({msg:"Cannot logout"}).status(500)
    }
})

app.get("/mutuals",async (req,res)=>{
    // let count=0;
    let {friend1,friend2} = req.body;
    // try {
    //     let usr1=null,usr2=null;
    //     let rb = await Mutual.findAll({
    //         where: {
    //             requested_by: friend1,
    //             status: "accepted"
    //         }
    //     })
    //     rb.forEach(async element => {
    //         let usr1 = await Mutual.findOne({
    //             where: {
    //                 requested_by: element.requested_to,
    //                 requested_to: friend2,
    //                 status:"accepted"
    //             }
    //         })
    //         if(!usr1){
    //             usr2 = await Mutual.findOne({
    //                 where:{
    //                     requested_to: element.requested_to,
    //                     requested_by: friend2,
    //                     status:"accepted"
    //                 }
    //             })
    //         }
    //         if(usr2 || usr1){
    //             count++;
    //         }
    //     });
        
    //     let rt = await Mutual.findAll({
    //         where: {
    //             requested_to: friend1,
    //             status: "accepted"
    //         }
    //     })
    //     usr1=null 
    //     usr2=null
    //     rt.forEach(async element => {
    //         let usr1 = await Mutual.findOne({
    //             where: {
    //                 requested_by: element.requested_by,
    //                 requested_to:friend2,
    //                 status:"accepted"
    //             }
    //         })
    //         if(!usr1){
    //             usr2 = await Mutual.findOne({
    //                 where: {
    //                     requested_to:element.requested_by,
    //                     requested_by:friend2,
    //                     status:"accepted"
    //                 }
    //             })
    //         }
    //         if (usr2 || usr1) {
    //             count++;
    //         }
    //     });
    // } catch (err) {
    //     res.json({msg:err}).status(500)
    // }
    let c = await mutualCount(friend1,friend2)
    console.log(c);
    // res.json({count:count});
})

io.on("connection", async (socket) => {
    socket.on("request", async (sent_by, sent_to) => {
        try {
            const request = await Mutual.create({
                'requested_by': sent_by,
                'requested_to': sent_to,
                'status': 'pending',
                'updated_by': sent_by
            })
            const result = await user.find({username:sent_to});
            if(result.active==="true" && request){
                socket.emit("get_request",{id:sent_to})
                socket.emit("response",{res:true})          // Request successfully sent
            }
            else if(!request){                
                socket.emit("response",{res:false})         // Some error encountered while sending request
            }
        } catch (err) {
            console.log(err);                
                socket.emit("response",{res:false})
        }
    })
    socket.on("login",async (login_id)=>{
        try {
        const active = await user.update({active:"true"},{
            where:{
                username:login_id
            }
        })
        console.log(login_id);
        
        } catch {
            // res.json({msg:"User not found"}).status(500)
            console.log("Error User not found");
        }
        try {
        const requests = await Mutual.findAll({
            where: {
                requested_to: login_id,
                status: "pending"
            }
        });
        requests.forEach(element => {
            console.log(element.dataValues);
            // code snippet to inform the user about the pending requests
        });
        } catch {
            
            // res.json({msg:"Error in finding requests"}).status(500)
            console.log("Error in finding requests");
        }
    })
    socket.on("logout",async (id)=>{
        try {
            const lOut = await user.update({active:"false"},{
                username: id
            });
        } catch (error) {
            console.log(error);
        }
    })
});

server.listen(3000, async ()=>{
    console.log("Server started");
    await sequelize.authenticate();
    console.log("Database synced");
})