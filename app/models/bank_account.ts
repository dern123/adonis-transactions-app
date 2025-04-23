import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'

export default class BankAccount extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public accountName!: string

  @column()
  public balance!: number

  @hasMany(() => Transaction)
  public transactions!: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
