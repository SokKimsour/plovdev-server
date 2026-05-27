const slugify = require('slugify')
const { Users } = require('../models')

const generateUsername = async (fullName) => {
  let baseUsername = slugify(fullName, {
    lower: true,
    replacement: '_',
    strict: true
  })

  // handle edge case for Khmer names
  if (!baseUsername) {
    baseUsername = 'user'
  }

  let username = baseUsername
  let counter = 1

  while (true) {
    const existing = await Users.findOne({ where: { userName: username } })
    if (!existing) break
    username = `${baseUsername}${counter}`
    counter++
  }

  return username
}


const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}


module.exports = {
  generateUsername,
  generateOtp
}