const fs= require('fs')
const crypto= require('crypto')

class Repository{

    constructor(fileName)
    {
        if(!fileName)
        {
            throw new Error('FileName does Not Exist')
        }

        this.fileName = fileName

        try {
            fs.accessSync(this.fileName)
        } catch (error) {
            fs.writeFileSync(this.fileName , '[]' )
        }
    } 

    async create(attribute)
    {
        attribute.id=this.randomId()
        const records = await this.getAll()     
        records.push(attribute)
        await this.writeAll(records)
        return attribute
    }

    async getAll()
    {
       return  JSON.parse(
        await fs.promises.readFile(this.fileName ,{
            encoding : 'utf8'
        })
       )
    }

    async writeAll(response)
    {
        await fs.promises.writeFile(this.fileName,JSON.stringify(response,null,2))
    }

    randomId()
    {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id)
    {
        const data = await this.getAll();
        //console.log(data);
        return data.find(record  =>  record.id===id  );
    }

    async delete(id)
    {
        const records = await this.getAll();
        const filteredRecord = records.filter(record => record.id!==id);
        this.writeAll(filteredRecord);
    }

    async update(id,attr)
    {
        const records= await this.getAll();
        const updateRecord = records.find(record =>  record.id===id);
        if(!updateRecord)
        {
            throw new Error('Record not found\n');
        }
        Object.assign(updateRecord , attr);
        this.writeAll(records);
    }

    async getOneUser(filterKey)
    {
        const records = await this.getAll();
       
        for(let record of records)
        {
            let found=true;
            for(let key in filterKey)
            {
                if(record[key]!==filterKey[key])
                {
                   found=false;
                }
            }
            if(found === true)
            {
                return record;
            }
        }
    }
}

module.exports = Repository