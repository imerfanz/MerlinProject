const User = require("../../../models/userModel");
const moment = require("moment-timezone");
const JDate = require("jalali-date");
const bcrypt = require("bcrypt");

// Create a Date object
const jdate = new JDate();
const accDate =
  jdate.getFullYear() +
  "-" +
  (jdate.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  jdate.getDate().toString().padStart(2, "0");
const mDate = moment().format("YYYY-MM-DD");

const user_add = async (req, res) => {
  try {
    const existingUser = await User.findOne({ phone: req.body.phone });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (!existingUser) {
      const userObject = {
        email: null,
        name: req.body.name,
        lastname: req.body.lastname ? req.body.lastname : null,
        passwordHash: hashedPassword,
        state: null,
        city: null,
        postalCode: null,
        address: null,
        phone: req.body.phone,
        invitedBy: req.body.invitedBy ? req.body.invitedBy : null,
        affiliates: [],
        notifications: [[`${req.body.name} به جمع ما خوش اومدی :)`, false]],
        createdAt: accDate,
        accountBalance: 0,
      };
      const newUser = new User(userObject);
      await newUser
        .save()
        .then(async (response) => {
          const invitation = response.invitedBy;
          await res
            .status(200)
            .send(`${req.body.name} , اکانت شما با موفقیت ثبت شد`);
          if (invitation) {
            try{
            const inviter = await User.findById(invitation);
            inviter.affiliates.push(response.name);
            inviter.notifications.push([`${response.name} با لینک شما وارد شد` , false])
            await inviter.save();
            console.log(inviter);
            }catch(err){
              console.log(err);
            }
          }
        })
        .catch((err) => {
          res.status(500).send("خطا در ثبت نام");
          console.log(err);
        });
    } else {
      res.status(403).send("این اکانت وجود دارد");
    }
  } catch (errot) {
    res.status(500).send("خطا در سرور");
  }
};

module.exports = {
  user_add,
};
