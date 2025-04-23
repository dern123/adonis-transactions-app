import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('date').notNullable()
      table.enum('type', ['income', 'expense']).notNullable()
      table.decimal('price', 15, 2).notNullable()
      table.decimal('balance_after', 15, 2).notNullable()
      table
        .integer('bank_account_id')
        .unsigned()
        .references('id')
        .inTable('bank_accounts')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
