require('dotenv').config({})
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require('cors')
const path = require('path')
const { start } = require('repl')
const Op = Sequelize.Op


let sequelize

if (process.env.NODE_ENV === 'development') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'sample.db',
        define: {
            timestamps: false
        }
    })
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
}

const Spacecraft = sequelize.define('spacecraft', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nume: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [4, 100]
        }
    },
    vitezaMaxima: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 1001
        }
    },
    masa: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 201
        }
    }
})

const Astronaut = sequelize.define('astronaut', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nume: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [4, 100]
        }
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['COMMANDER', 'PILOT', 'CAPTAIN']]
        }
    }
});

Spacecraft.hasMany(Astronaut, { foreignKey: 'spacecraftId' });
Astronaut.belongsTo(Spacecraft, { foreignKey: 'spacecraftId' });

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())

app.get('/sync', async (req, res) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'tables created' })
    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.get('/spacecrafts', async (req, res) => {
    try {
        const query = {}
        let limit = 5
        const allowedFilters = ['vitezaMaxima', 'nume', 'masa']
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
        console.error(filterKeys)
        if (filterKeys.length > 0) {
            query.where = {}
            for (const key of filterKeys) {
                let value = req.query[key]
                if (key === 'vitezaMaxima' || key === 'masa') {
                    value = parseFloat(value)
                    query.where[key] = { [Op.eq]: value }
                }
                else {
                    query.where[key] = { [Op.like]: `${value}` }
                }

            }
            console.log(query.where)
        }

        const sortField = req.query.sortField
        let sortOrder = 'ASC'
        if (req.query.sortOrder && req.query.sortOrder === '-1') {
            sortOrder = 'DESC'
        }

        if (req.query.limit) {
            limit = parseInt(req.query.limit)
        }

        if (sortField) {
            query.order = [[sortField, sortOrder]]
        }

        if (!isNaN(parseInt(req.query.page))) {
            query.limit = limit
            query.offset = limit * parseInt(req.query.page)
        }

        const records = await Spacecraft.findAll(query)
        const numberOfSpacecrafts = await Spacecraft.count()

        res.status(200).json({ records, numberOfSpacecrafts })
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'Server error' })
    }
})

app.post('/spacecrafts', async (req, res) => {
    try {
        await Spacecraft.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.get('/spacecrafts/:sid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid, { include: Astronaut })
        if (spacecraft) {
            res.status(200).json(spacecraft)
        } else {
            res.status(404).json({ message: "not found" })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.put('/spacecrafts/:sid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            await spacecraft.update(req.body, { fields: ['nume', 'vitezaMaxima', 'masa'] })
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.delete('/spacecrafts/:sid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            await spacecraft.destroy()
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.get('/spacecrafts/:sid/astronauts', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts()
            res.status(200).json(astronauts)
        } else {
            res.status(404).json({ message: "not found" })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

//!
app.post('/spacecrafts/:sid/astronauts', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            const astronaut = req.body
            astronaut.spacecraftId = spacecraft.id
            await Astronaut.create(astronaut)
            res.status(201).json({ message: 'created' })
        } else {
            res.status(404).json({ message: 'not found' })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.get('/spacecrafts/:sid/astronauts/:aid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts(({ where: { id: req.params.aid } }))
            const astronaut = astronauts.shift()
            if (astronaut) {
                res.status(200).json(astronaut)
            } else {
                res.status(404).json({ message: "Astronaut not found" })
            }
        } else {
            res.status(404).json({ message: "Spacecraft not found" })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.put('/spacecrafts/:sid/astronauts/:aid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts(({ where: { id: req.params.aid } }))
            const astronaut = astronauts.shift()
            if (astronaut) {
                await astronaut.update(req.body)
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(404).json({ message: " Astronaut not found" })
            }
        } else {
            res.status(404).json({ message: "Spacecraft not found" })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.delete('/spacecrafts/:sid/astronauts/:aid', async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts(({ where: { id: req.params.aid } }))
            const astronaut = astronauts.shift()
            if (astronaut) {
                await astronaut.destroy(req.body)
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(404).json({ message: " Astronaut not found" })
            }
        } else {
            res.status(404).json({ message: "Spacecraft not found" })
        }

    } catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'some error occured' })
    }
})

app.listen(process.env.PORT, async () => {
    await sequelize.sync({ alter: true })
})