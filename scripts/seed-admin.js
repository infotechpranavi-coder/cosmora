const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://infotechpranavi_db_user:46tvRhmFSIcpwDWb@cluster0.nq9rxoz.mongodb.net/cosmora?retryWrites=true&w=majority&appName=Cluster0'

async function main() {
  await mongoose.connect(uri)
  const User =
    mongoose.models.User ||
    mongoose.model(
      'User',
      new mongoose.Schema(
        {
          email: String,
          password: String,
          firstName: String,
          lastName: String,
          role: { type: String, default: 'customer' },
          isActive: { type: Boolean, default: true },
          emailVerified: Boolean,
          preferences: Object,
        },
        { timestamps: true }
      )
    )

  const email = 'admin@cosmara.com'
  const password = 'admin@123'
  const hash = await bcrypt.hash(password, 12)

  await User.updateOne({ email: 'admin@alankarika.com' }, { $set: { isActive: false } })

  const existing = await User.findOne({ email })
  if (existing) {
    existing.password = hash
    existing.role = 'admin'
    existing.isActive = true
    existing.firstName = 'Admin'
    existing.lastName = 'Cosmora'
    await existing.save()
    console.log('UPDATED', email)
  } else {
    await User.create({
      email,
      password: hash,
      firstName: 'Admin',
      lastName: 'Cosmora',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      preferences: { newsletter: true, notifications: true },
    })
    console.log('CREATED', email)
  }

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
