import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BankAccount from './bank_account.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column.date()
  public date!: DateTime

  @column()
  public type!: 'income' | 'expense'

  @column()
  public price!: number

  @column()
  public balanceAfter!: number

  @column()
  public bankAccountId!: number

  @belongsTo(() => BankAccount)
  public bankAccount!: BelongsTo<typeof BankAccount>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
