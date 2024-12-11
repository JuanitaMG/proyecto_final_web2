import { defineProducts } from './products.model.js'
import { defineOrders } from './order.model.js'
import { defineUsers } from './users.model.js'

export function defineModels(sequelize){
    defineProducts(sequelize)
    defineUsers(sequelize)
    defineOrders(sequelize)
}