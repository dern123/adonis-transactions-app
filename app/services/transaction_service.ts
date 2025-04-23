import Transaction from '#models/transaction'
import BankAccount from '#models/bank_account'
import redis from '../lib/redis.js'


export class TransactionService {
  static async updateTransactionWithRecalculation(id: number, newData: Partial<Transaction>) {
    const transaction = await Transaction.findOrFail(id)

    // Зберігаємо стару дельту
    const oldBalance = transaction.balanceAfter
    const oldPrice = transaction.price
    const oldType = transaction.type

    // Оновлюємо
    if (newData.price !== undefined) transaction.price = newData.price
    if (newData.type !== undefined) transaction.type = newData.type
    await transaction.save()

    // Розраховуємо новий balanceAfter
    const prev = await Transaction
      .query()
      .where('bank_account_id', transaction.bankAccountId)
      .where('id', '<', transaction.id)
      .orderBy('id', 'desc')
      .first()

    let runningBalance = prev?.balanceAfter ?? 0
    runningBalance += transaction.type === 'income' ? transaction.price : -transaction.price
    transaction.balanceAfter = runningBalance
    await transaction.save()

    // Отримуємо всі наступні транзакції
    const nextTransactions = await Transaction
      .query()
      .where('bank_account_id', transaction.bankAccountId)
      .where('id', '>', transaction.id)
      .orderBy('id')

    for (const tx of nextTransactions) {
      runningBalance += tx.type === 'income' ? tx.price : -tx.price
      tx.balanceAfter = runningBalance
      await tx.save()

      // Кешуємо в Redis (опціонально)
      await redis.set(`tx:${tx.id}:balance`, runningBalance.toString())
    }

    // Оновлюємо остаточний баланс рахунку
    const bankAccount = await BankAccount.findOrFail(transaction.bankAccountId)
    bankAccount.balance = runningBalance
    await bankAccount.save()
    await redis.set(`account:${bankAccount.id}:balance`, runningBalance.toString())
  }
}
