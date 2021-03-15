const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt)

class userRepository extends Repository
{
    async create(attribute) 
    {
        attribute.id=this.randomId();
        const salt = crypto.randomBytes(8).toString('hex')
        const buf = await scrypt(attribute.password,salt,64);
        const hashed=buf.toString('hex')

        const response = await this.getAll()
        
        const record = {
            ...attribute,
            password:`${hashed}.${salt}`
        }
        response.push(record)
        await this.writeAll(response)
        return record;
    }

    async comparePasswords(saved,supplied)
    {
        const [hashed , salt ] = saved.split('.')
        const buff= await scrypt(supplied,salt,64)
        const newHash=buff.toString('hex')
        return hashed===newHash
    }

}

module.exports = new userRepository('users.json')