// // const mongoose = require('mongoose');
// // const bcrypt = require('bcrypt')

// // const userSchema = new mongoose.Schema({
// //     username:{required:true,type:String},
// //     password:{required:true,type:String}
// // },{timestamps:true})

// // userSchema.prev('save', async function(next){
// //     const user = this;
// //     if(user.isModified('password')){
// //         user.password = await bcrypt.hash(user.password,10);
// //     }
// // })
// // module.exports = mongoose.model('User',userSchema);



// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema(
//   {
//     email: { required: true, type: String, unique: true },
//     password: { required: true, type: String }
//   },
//   { timestamps: true }
// );

// // ✅ Correct pre-save hook
// userSchema.pre('save', async function (next) {
//   // Only hash if password is new or modified
//   if (!this.isModified('password')) return next();

//   try {
//     const saltRounds = 10;
//     const hashed = await bcrypt.hash(this.password, saltRounds);
//     this.password = hashed;
//     next();
//   } catch (err) {
//     return next(err);
//   }
// });

// // ✅ Optional: add method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true, // 🔒 prevent duplicates
//   },
//   password: {
//     type: String,
//     required: true,
//   }
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true  // Prevent duplicate emails
//   },
//   password: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String }, 
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
 
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    }
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it was modified or is new
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// ✅ Method to compare passwords (used in login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Export model
module.exports = mongoose.model('User', userSchema);
