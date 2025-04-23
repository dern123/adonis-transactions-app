import { BaseSeeder } from '@adonisjs/lucid/seeders'
import BankAccount from '#models/bank_account'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    // 1. Створимо банківський рахунок
    const bankAccount = await BankAccount.create({
      accountName: 'Main Account',
      balance: 0,
    })

    let balance = 0

    // 2. Створимо 10 000 транзакцій
    for (let i = 0; i < 10000; i++) {
      const type = Math.random() > 0.5 ? 'income' : 'expense'
      const price = +(Math.random() * 1000).toFixed(2)

      balance = type === 'income' ? balance + price : balance - price

      await Transaction.create({
        date: DateTime.now().minus({ days: 10000 - i }),
        type,
        price,
        balanceAfter: balance,
        bankAccountId: bankAccount.id,
      })
    }

    // 3. Оновимо баланс рахунку
    bankAccount.balance = balance
    await bankAccount.save()
  }
}
